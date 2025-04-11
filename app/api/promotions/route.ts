import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const isActive = searchParams.get("isActive")

    const whereClause: any = {}

    if (code) {
      whereClause.code = code
    }

    if (isActive) {
      whereClause.isActive = isActive === "true"
    }

    const promotions = await prisma.promotion.findMany({
      where: whereClause,
      include: {
        tickets: true,
      },
    })

    return NextResponse.json(promotions)
  } catch (error) {
    console.error("Error fetching promotions:", error)
    return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.code || !body.description || !body.type || !body.value || !body.startDate || !body.expiryDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate dates
    const startDate = new Date(body.startDate)
    const expiryDate = new Date(body.expiryDate)
    
    if (startDate >= expiryDate) {
      return NextResponse.json({ error: "Expiry date must be after start date" }, { status: 400 })
    }

    // Validate value based on type
    if (body.type === "PERCENTAGE" && (body.value <= 0 || body.value > 100)) {
      return NextResponse.json({ error: "Percentage value must be between 0 and 100" }, { status: 400 })
    }

    if (body.type === "FIXED_AMOUNT" && body.value <= 0) {
      return NextResponse.json({ error: "Fixed amount must be greater than 0" }, { status: 400 })
    }

    const promotion = await prisma.promotion.create({
      data: body,
    })

    return NextResponse.json(promotion, { status: 201 })
  } catch (error) {
    console.error("Error creating promotion:", error)
    return NextResponse.json({ error: "Failed to create promotion" }, { status: 500 })
  }
} 