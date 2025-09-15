import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET user preferences
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const userId = id
    
    let preferences = await prisma.userPreferences.findUnique({
      where: { userId },
    })
    
    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: {
          userId,
          timeFormat: "TWENTY_FOUR_HOUR",
          durationFormat: "MINUTES_ONLY",
          currency: "NIS",
        },
      })
    }
    
    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    return NextResponse.json({ error: "Failed to fetch user preferences" }, { status: 500 })
  }
}

// UPDATE user preferences
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const userId = id
    const data = await request.json()
    
    const { timeFormat, durationFormat, currency } = data
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    const preferences = await prisma.userPreferences.upsert({
      where: { userId },
      update: {
        timeFormat: timeFormat || undefined,
        durationFormat: durationFormat || undefined,
        currency: currency || undefined,
      },
      create: {
        userId,
        timeFormat: timeFormat || "TWENTY_FOUR_HOUR",
        durationFormat: durationFormat || "MINUTES_ONLY",
        currency: currency || "NIS",
      },
    })
    
    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Error updating user preferences:", error)
    return NextResponse.json({ error: "Failed to update user preferences" }, { status: 500 })
  }
}