import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST: Like a review
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: reviewId } = await params
    const body = await request.json()
    const { id, userId } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if the review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        likedBy: true,
      },
    })

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Check if user already liked this review
    const alreadyLiked = review.likedBy.some((user) => user.id === userId)

    if (alreadyLiked) {
      return NextResponse.json({ error: "User already liked this review" }, { status: 400 })
    }

    // Add the like
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        id,
        likes: review.likes + 1,
        likedBy: {
          connect: { id: userId },
        },
      },
      include: {
        likedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error("Error liking review:", error)
    return NextResponse.json({ error: "Failed to like review" }, { status: 500 })
  }
}


export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: reviewId } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if the review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        likedBy: true,
      },
    })

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Check if user liked this review
    const alreadyLiked = review.likedBy.some((user) => user.id === userId)

    if (!alreadyLiked) {
      return NextResponse.json({ error: "User has not liked this review" }, { status: 400 })
    }

    // Remove the like
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        likes: review.likes - 1,
        likedBy: {
          disconnect: { id: userId },
        },
      },
      include: {
        likedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error("Error unliking review:", error)
    return NextResponse.json({ error: "Failed to unlike review" }, { status: 500 })
  }
}

