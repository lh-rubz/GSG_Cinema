import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const movieId = searchParams.get("movieId")
    const userId = searchParams.get("userId")

    const whereClause: any = {}

    if (movieId) {
      whereClause.movieId = movieId
    }

    if (userId) {
      whereClause.userId = userId
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profileImage: true,
          },
        },
        movie: {
          select: {
            id: true,
            title: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                profileImage: true,
              },
            },
          },
        },
        likedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, movieId, rating, comment } = body

    // Validate required fields
    if (!userId || !movieId || rating === undefined || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already reviewed this movie
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        movieId,
      },
    })

    if (existingReview) {
      return NextResponse.json({ error: "User has already reviewed this movie" }, { status: 400 })
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        userId,
        movieId,
        rating,
        comment,
        date: new Date().toISOString(),
        likes: 0,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profileImage: true,
          },
        },
        movie: {
          select: {
            id: true,
            title: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}

