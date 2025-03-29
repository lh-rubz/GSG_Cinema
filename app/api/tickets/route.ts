import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const showtimeId = searchParams.get("showtimeId")
    const status = searchParams.get("status")

    const whereClause: any = {}

    if (userId) {
      whereClause.userId = userId
    }

    if (showtimeId) {
      whereClause.showtimeId = showtimeId
    }

    if (status) {
      whereClause.status = status
    }

    const tickets = await prisma.ticket.findMany({
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
        showtime: {
          include: {
            movie: true,
            screen: true,
          },
        },
        seat: true,
        receipt: true,
      },
    })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, showtimeId, seatId, price } = body

    if (!userId || !showtimeId || !seatId || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 })
    }

    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: {
        movie: true,
      },
    })

    if (!showtime) {
      return NextResponse.json({ error: "Showtime not found" }, { status: 400 })
    }

    // Check if the seat exists and is available
    const seat = await prisma.seat.findUnique({
      where: { id: seatId },
    })

    if (!seat) {
      return NextResponse.json({ error: "Seat not found" }, { status: 400 })
    }

    // Check if the seat is already booked for this showtime
    const existingTicket = await prisma.ticket.findFirst({
      where: {
        showtimeId,
        seatId,
        status: {
          in: ["reserved", "paid"],
        },
      },
    })

    if (existingTicket) {
      return NextResponse.json({ error: "Seat is already booked for this showtime" }, { status: 400 })
    }

    const ticket = await prisma.ticket.create({
      data: {
        userId,
        showtimeId,
        seatId,
        price,
        purchaseDate: new Date().toISOString(),
        status: "reserved",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true,
          },
        },
        showtime: {
          include: {
            movie: true,
          },
        },
        seat: true,
      },
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error("Error creating ticket:", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}

