import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id || "" },
      select: {
        role: true,
        id: true,
        username: true,
        displayName: true,
        bio: true,
        email: true,
        gender: true,
        profileImage: true,
        reviews: {
          include: {
            movie: true,
          },
        },
        tickets: {
          include: {
            showtime: {
              include: {
                movie: true,
              },
            },
            seat: true,
          },
        },
        receipts: {
          include: {
            movie: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Check if username or email already exists (if being updated)
    if (body.username || body.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [body.username ? { username: body.username } : {}, body.email ? { email: body.email } : {}],
          NOT: {
            id: params.id,
          },
        },
      })

      if (existingUser) {
        return NextResponse.json({ error: "Username or email already exists" }, { status: 400 })
      }
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userWithRelations = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            tickets: true,
            receipts: true,
            reviews: true,
            replies: true,
          },
        },
      },
    })

    if (!userWithRelations) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete all related data
    await prisma.reply.deleteMany({
      where: { userId: params.id },
    })

    // Delete reviews
    const reviews = await prisma.review.findMany({
      where: { userId: params.id },
      select: { id: true },
    })

    for (const review of reviews) {
      await prisma.reply.deleteMany({
        where: { reviewId: review.id },
      })
    }

    await prisma.review.deleteMany({
      where: { userId: params.id },
    })

    // Delete tickets
    await prisma.ticket.deleteMany({
      where: { userId: params.id },
    })

    // Delete receipts
    await prisma.receipt.deleteMany({
      where: { userId: params.id },
    })

    // delete the user
    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

