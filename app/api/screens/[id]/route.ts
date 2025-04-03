import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const screen = await prisma.screen.findUnique({
      where: { id: params.id },
      include: {
        seats: {
          orderBy: [{ row: "asc" }, { col: "asc" }],
        },
        showtimes: {
          include: {
            movie: true,
          },
        },
      },
    })

    if (!screen) {
      return NextResponse.json({ error: "Screen not found" }, { status: 404 })
    }

    const rows = screen.rows
    const cols = screen.cols
    const seatMap: any[][] = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(null))

    screen.seats.forEach((seat) => {
      if (seat.row < rows && seat.col < cols) {
        seatMap[seat.row][seat.col] = seat
      }
    })

    return NextResponse.json({
      ...screen,
      seatMap,
    })
  } catch (error) {
    console.error("Error fetching screen:", error)
    return NextResponse.json({ error: "Failed to fetch screen" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const existingScreen = await prisma.screen.findUnique({
      where: { id: params.id },
    })

    if (!existingScreen) {
      return NextResponse.json({ error: "Screen not found" }, { status: 404 })
    }

    const screen = await prisma.screen.update({
      where: { id: params.id },
      data: {
        name: body.name,
        type: body.type,
        capacity: body.capacity,
      },
      include: {
        seats: true,
      },
    })

    return NextResponse.json(screen)
  } catch (error) {
    console.error("Error updating screen:", error)
    return NextResponse.json({ error: "Failed to update screen" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const showtimesCount = await prisma.showtime.count({
      where: { screenId: params.id },
    })

    if (showtimesCount > 0) {
      return NextResponse.json({ error: "Cannot delete screen with existing showtimes" }, { status: 400 })
    }

    await prisma.seat.deleteMany({
      where: { screenId: params.id },
    })

    await prisma.screen.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Screen deleted successfully" })
  } catch (error) {
    console.error("Error deleting screen:", error)
    return NextResponse.json({ error: "Failed to delete screen" }, { status: 500 })
  }
}

