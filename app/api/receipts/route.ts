import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { TicketStatus } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const movieId = searchParams.get("movieId")

    const whereClause: any = {}

    if (userId) {
      whereClause.userId = userId
    }

    if (movieId) {
      whereClause.movieId = movieId
    }

    const receipts = await prisma.receipt.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true,
          },
        },
        movie: true,
        tickets: {
          include: {
            seat: true,
            showtime: true,
          },
        },
      },
    })

    return NextResponse.json(receipts)
  } catch (error) {
    console.error("Error fetching receipts:", error)
    return NextResponse.json({ error: "Failed to fetch receipts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {id, userId, movieId, ticketIds, totalPrice, paymentMethod } = body

    // Validate required fields
    if (!userId || !movieId || !ticketIds || !totalPrice || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if all tickets exist and belong to the same user and movie
    const tickets = await prisma.ticket.findMany({
      where: {
        id: {
          in: ticketIds,
        },
      },
      include: {
        showtime: true,
      },
    })

    if (tickets.length !== ticketIds.length) {
      return NextResponse.json({ error: "One or more tickets not found" }, { status: 400 })
    }

    // Check if all tickets belong to the same user
    const allBelongToUser = tickets.every((ticket) => ticket.userId === userId)
    if (!allBelongToUser) {
      return NextResponse.json({ error: "All tickets must belong to the same user" }, { status: 400 })
    }

    // Check if all tickets are for the same movie
    const allForSameMovie = tickets.every((ticket) => ticket.showtime.movieId === movieId)
    if (!allForSameMovie) {
      return NextResponse.json({ error: "All tickets must be for the same movie" }, { status: 400 })
    }

    // Check if any ticket is already part of another receipt
    const anyInReceipt = tickets.some((ticket) => ticket.receiptId !== null)
    if (anyInReceipt) {
      return NextResponse.json({ error: "One or more tickets are already part of a receipt" }, { status: 400 })
    }

    // Create the receipt
    const receipt = await prisma.receipt.create({
      data: {
        id,
        userId,
        movieId,
        totalPrice,
        paymentMethod,
        receiptDate: new Date().toISOString(),
      },
    })

    // Update all tickets to be part of this receipt and mark as paid
    await Promise.all(
      ticketIds.map(async (ticketId: string) => {
        await prisma.ticket.update({
          where: { id: ticketId },
          data: {
            receiptId: receipt.id,
            status: TicketStatus.paid,
          },
        })
      }),
    )

    // Fetch the complete receipt with all relationships
    const completeReceipt = await prisma.receipt.findUnique({
      where: { id: receipt.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true,
          },
        },
        movie: true,
        tickets: {
          include: {
            seat: true,
            showtime: true,
          },
        },
      },
    })

    return NextResponse.json(completeReceipt, { status: 201 })
  } catch (error) {
    console.error("Error creating receipt:", error)
    return NextResponse.json({ error: "Failed to create receipt" }, { status: 500 })
  }
}

