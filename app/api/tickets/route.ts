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
    console.log("Received ticket creation request with body:", body)
    const { id, userId, showtimeId, seatId, price, status } = body

    if (!userId || !showtimeId || !seatId || price === undefined) {
      console.log("Missing required fields:", { userId, showtimeId, seatId, price })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      console.log("User not found:", userId)
      return NextResponse.json({ error: "User not found" }, { status: 400 })
    }

    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: {
        movie: true,
      },
    })

    if (!showtime) {
      console.log("Showtime not found:", showtimeId)
      return NextResponse.json({ error: "Showtime not found" }, { status: 400 })
    }

    // Check if the seat exists and is available
    const seat = await prisma.seat.findUnique({
      where: { id: seatId },
    })

    if (!seat) {
      console.log("Seat not found:", seatId)
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
      console.log("Seat already booked:", { showtimeId, seatId })
      return NextResponse.json({ error: "Seat is already booked for this showtime" }, { status: 400 })
    }

    const ticket = await prisma.ticket.create({
      data: {
        id,
        userId,
        showtimeId,
        seatId,
        price,
        purchaseDate: new Date().toISOString(),
        status: status || "reserved",
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

    console.log("Successfully created ticket:", ticket)
    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error("Error creating ticket:", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}

