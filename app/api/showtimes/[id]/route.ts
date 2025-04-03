import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const showtime = await prisma.showtime.findUnique({
      where: { id: params.id },
      include: {
        movie: true,
        screen: true,
        tickets: {
          include: {
            seat: true,
            user: true,
          },
        },
      },
    })

    if (!showtime) {
      return NextResponse.json({ error: "Showtime not found" }, { status: 404 })
    }

    return NextResponse.json(showtime)
  } catch (error) {
    console.error("Error fetching showtime:", error)
    return NextResponse.json({ error: "Failed to fetch showtime" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Check if the showtime exists
    const existingShowtime = await prisma.showtime.findUnique({
      where: { id: params.id },
    })

    if (!existingShowtime) {
      return NextResponse.json({ error: "Showtime not found" }, { status: 404 })
    }

    // If changing screen, date, or time, check for conflicts
    if (
      (body.screenId && body.screenId !== existingShowtime.screenId) ||
      (body.date && body.date !== existingShowtime.date) ||
      (body.time && body.time !== existingShowtime.time)
    ) {
      const conflictingShowtime = await prisma.showtime.findFirst({
        where: {
          screenId: body.screenId || existingShowtime.screenId,
          date: body.date || existingShowtime.date,
          time: body.time || existingShowtime.time,
          NOT: {
            id: params.id,
          },
        },
      })

      if (conflictingShowtime) {
        return NextResponse.json({ error: "Time conflict with another showtime on this screen" }, { status: 400 })
      }
    }

    const showtime = await prisma.showtime.update({
      where: { id: params.id },
      data: body,
      include: {
        movie: true,
        screen: true,
      },
    })

    return NextResponse.json(showtime)
  } catch (error) {
    console.error("Error updating showtime:", error)
    return NextResponse.json({ error: "Failed to update showtime" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if there are any tickets for this showtime
    const ticketsCount = await prisma.ticket.count({
      where: { showtimeId: params.id },
    })

    if (ticketsCount > 0) {
      return NextResponse.json({ error: "Cannot delete showtime with existing tickets" }, { status: 400 })
    }

    await prisma.showtime.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Showtime deleted successfully" })
  } catch (error) {
    console.error("Error deleting showtime:", error)
    return NextResponse.json({ error: "Failed to delete showtime" }, { status: 500 })
  }
}

