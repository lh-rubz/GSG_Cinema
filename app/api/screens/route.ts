import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { SeatType } from "@prisma/client"
import { ScreenInput } from "@/types/types"

// GET: Fetch all screens
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const includeSeatMap = searchParams.get("includeSeatMap") === "true"

    const whereClause: any = {}

    if (type) {
      whereClause.type = {
        has: type,
      }
    }

    const screens = await prisma.screen.findMany({
      where: whereClause,
      include: {
        seats: includeSeatMap, 
        _count: {
          select: {
            showtimes: true,
          },
        },
      },
    })

    // If seatMap is requested, transform each screen to include a seatMap
    const transformedScreens = screens.map((screen) => {
      if (!includeSeatMap) {
        return screen
      }

      // Transform seats into a 2D array for easier frontend rendering
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

      return {
        ...screen,
        seatMap,
      }
    })

    return NextResponse.json(transformedScreens)
  } catch (error) {
    console.error("Error fetching screens:", error)
    return NextResponse.json({ error: "Failed to fetch screens" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {id, name, type, capacity, rows, cols, seatMap } = body

    if (!name || !type || !capacity || !rows || !cols) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const screen = await prisma.screen.create({
      data: {
        id,
        name,
        type,
        capacity,
        rows,
        cols,
      },
    })

    if (seatMap) {
      const seats = []

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (seatMap[row] && seatMap[row][col]) {
            const seatData = seatMap[row][col]
            
            const seatType = seatData.type 
            ? (seatData.type.toLowerCase() as SeatType)
            : SeatType.standard

            seats.push({
              id: seatData.id,
              screenId: screen.id,
              number: seatData.number || `R${row + 1}C${col + 1}`,
              type: seatType,
              available: seatData.available !== undefined ? seatData.available : true,
              row: row,
              col: col,
              age: seatData.age,
            })
          }
        }
      }

      if (seats.length > 0) {
        await prisma.seat.createMany({
          data: seats,
        })
      }
    } else {
      // Create default seats if no seat map is provided
      const seats = []

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          seats.push({
            screenId: screen.id,
            number: `R${row + 1}C${col + 1}`,
            type: SeatType.standard,
            available: true,
            row: row,
            col: col,
          })
        }
      }

      await prisma.seat.createMany({
        data: seats,
      })
    }

    const screenWithSeats = await prisma.screen.findUnique({
      where: { id: screen.id },
      include: {
        seats: true,
      },
    })

    return NextResponse.json(screenWithSeats, { status: 201 })
  } catch (error) {
    console.error("Error creating screen:", error)
    return NextResponse.json({ error: "Failed to create screen" }, { status: 500 })
  }
}

