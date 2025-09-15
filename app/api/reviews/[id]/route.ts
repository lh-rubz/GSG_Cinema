import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const review = await prisma.review.findUnique({
      where: { id: id },
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
          orderBy: {
            date: "asc",
          },
        },
        likedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error("Error fetching review:", error)
    return NextResponse.json({ error: "Failed to fetch review" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if the review exists
    const existingReview = await prisma.review.findUnique({
      where: { id: id },
    })

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Only allow the review owner to update it
    if (body.userId && body.userId !== existingReview.userId) {
      return NextResponse.json({ error: "Only the review owner can update it" }, { status: 403 })
    }

    // Validate rating range if provided (1-5 stars)
    if (body.rating !== undefined && (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5)) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const review = await prisma.review.update({
      where: { id: id },
      data: {
        rating: body.rating,
        comment: body.comment,
      },
      include: {
        user: true,
        movie: true,
        replies: {
          include: {
            user: true,
          },
        },
      },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Check if the review exists
    const review = await prisma.review.findUnique({
      where: { id: id },
    })

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    await prisma.reply.deleteMany({
      where: { reviewId: id },
    })

    await prisma.review.delete({
      where: { id: id },
    })

    return NextResponse.json({ message: "Review deleted successfully" })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}

