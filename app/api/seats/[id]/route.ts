import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const seat = await prisma.seat.findUnique({
      where: { id: id },
      include: {
        screen: true,
      },
    })

    if (!seat) {
      return NextResponse.json({ error: "Seat not found" }, { status: 404 })
    }

    return NextResponse.json(seat)
  } catch (error) {
    console.error("Error fetching seat:", error)
    return NextResponse.json({ error: "Failed to fetch seat" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const existingSeat = await prisma.seat.findUnique({
      where: { id: id },
    })

    if (!existingSeat) {
      return NextResponse.json({ error: "Seat not found" }, { status: 404 })
    }

    const seat = await prisma.seat.update({
      where: { id: id },
      data: {
        number: body.number,
        type: body.type,
        available: body.available,
        age: body.age,
      },
    })

    return NextResponse.json(seat)
  } catch (error) {
    console.error("Error updating seat:", error)
    return NextResponse.json({ error: "Failed to update seat" }, { status: 500 })
  }
}

