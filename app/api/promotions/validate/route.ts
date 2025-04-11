import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, showtimeId, totalPrice } = body

    if (!code || !showtimeId || !totalPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find the promotion
    const promotion = await prisma.promotion.findUnique({
      where: { code },
    })

    if (!promotion) {
      return NextResponse.json({ error: "Invalid promotion code" }, { status: 404 })
    }

    // Check if promotion is active
    if (!promotion.isActive) {
      return NextResponse.json({ error: "Promotion is not active" }, { status: 400 })
    }

    // Check if promotion is within date range
    const currentDate = new Date()
    const startDate = new Date(promotion.startDate)
    const expiryDate = new Date(promotion.expiryDate)

    if (currentDate < startDate || currentDate > expiryDate) {
      return NextResponse.json({ error: "Promotion is not valid at this time" }, { status: 400 })
    }

    // Calculate discount amount
    let discountAmount = 0

    switch (promotion.type) {
      case "PERCENTAGE":
        discountAmount = (totalPrice * promotion.value) / 100
        break
      case "FIXED_AMOUNT":
        discountAmount = promotion.value
        break
      case "BUY_ONE_GET_ONE":
        // For BOGO, we'll need to handle this differently based on your business logic
        discountAmount = totalPrice / 2 // This is a simple implementation
        break
    }

    // Ensure discount doesn't exceed total price
    if (discountAmount > totalPrice) {
      discountAmount = totalPrice
    }

    return NextResponse.json({
      valid: true,
      promotion,
      discountAmount,
      finalPrice: totalPrice - discountAmount,
    })
  } catch (error) {
    console.error("Error validating promotion:", error)
    return NextResponse.json({ error: "Failed to validate promotion" }, { status: 500 })
  }
} 