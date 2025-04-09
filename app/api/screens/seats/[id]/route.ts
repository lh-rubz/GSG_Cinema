import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { available } = body

    if (available === undefined) {
      return NextResponse.json({ error: "Available status is required" }, { status: 400 })
    }

    const existingSeat = await prisma.seat.findUnique({
      where: { id: params.id },
    })

    if (!existingSeat) {
      return NextResponse.json({ error: "Seat not found" }, { status: 404 })
    }

    const seat = await prisma.seat.update({
      where: { id: params.id },
      data: {
        available
      },
    })

    return NextResponse.json(seat)
  } catch (error) {
    console.error("Error updating seat status:", error)
    return NextResponse.json({ error: "Failed to update seat status" }, { status: 500 })
  }
} 