import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    const promotion = await prisma.promotion.findUnique({
      where: { id },
      include: {
        tickets: true,
      },
    })

    if (!promotion) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 })
    }

    return NextResponse.json(promotion)
  } catch (error) {
    console.error("Error fetching promotion:", error)
    return NextResponse.json({ error: "Failed to fetch promotion" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate required fields
    if (body.code || body.type || body.value || body.startDate || body.expiryDate) {
      if (body.type === "PERCENTAGE" && (body.value <= 0 || body.value > 100)) {
        return NextResponse.json({ error: "Percentage value must be between 0 and 100" }, { status: 400 })
      }

      if (body.type === "FIXED_AMOUNT" && body.value <= 0) {
        return NextResponse.json({ error: "Fixed amount must be greater than 0" }, { status: 400 })
      }

      if (body.startDate && body.expiryDate) {
        const startDate = new Date(body.startDate)
        const expiryDate = new Date(body.expiryDate)
        
        if (startDate >= expiryDate) {
          return NextResponse.json({ error: "Expiry date must be after start date" }, { status: 400 })
        }
      }
    }

    const promotion = await prisma.promotion.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(promotion)
  } catch (error) {
    console.error("Error updating promotion:", error)
    return NextResponse.json({ error: "Failed to update promotion" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    await prisma.promotion.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Promotion deleted successfully" })
  } catch (error) {
    console.error("Error deleting promotion:", error)
    return NextResponse.json({ error: "Failed to delete promotion" }, { status: 500 })
  }
} 