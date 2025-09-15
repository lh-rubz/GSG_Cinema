import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const ticket = await prisma.ticket.findUnique({
      where: { id: id },
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

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error fetching ticket:", error)
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const existingTicket = await prisma.ticket.findUnique({
      where: { id: id },
    })

    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    // If changing seat, check if the new seat is available
    if (body.seatId && body.seatId !== existingTicket.seatId) {
      const existingSeatTicket = await prisma.ticket.findFirst({
        where: {
          showtimeId: existingTicket.showtimeId,
          seatId: body.seatId,
          status: {
            in: ["reserved", "paid"],
          },
          NOT: {
            id: id,
          },
        },
      })

      if (existingSeatTicket) {
        return NextResponse.json({ error: "Seat is already booked for this showtime" }, { status: 400 })
      }
    }

    const ticket = await prisma.ticket.update({
      where: { id: id },
      data: body,
      include: {
        user: true,
        showtime: {
          include: {
            movie: true,
          },
        },
        seat: true,
      },
    })

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error updating ticket:", error)
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
  }
}


export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const reason = searchParams.get("reason") || "Cancelled by user"

    const ticket = await prisma.ticket.findUnique({
      where: { id: id },
    })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    if (ticket.receiptId) {
      await prisma.ticket.update({
        where: { id: id },
        data: {
          status: "deleted",
          deleteReason: reason,
        },
      })

      return NextResponse.json({ message: "Ticket marked as deleted" })
    } else {
      await prisma.ticket.delete({
        where: { id: id },
      })

      return NextResponse.json({ message: "Ticket deleted successfully" })
    }
  } catch (error) {
    console.error("Error deleting ticket:", error)
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 })
  }
}

