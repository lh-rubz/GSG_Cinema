// app/api/replies/[id]/report/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if the reply exists
    const reply = await prisma.reply.findUnique({
      where: { id: params.id },
    })

    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 })
    }

    // Check if the user has already reported this reply
    const existingReport = await prisma.replyReport.findUnique({
      where: {
        replyId_userId: {
          replyId: params.id,
          userId,
        },
      },
    })

    if (existingReport) {
      return NextResponse.json(
        { error: "You have already reported this reply" },
        { status: 400 }
      )
    }

    // Create a report
    await prisma.replyReport.create({
      data: {
        replyId: params.id,
        userId,
      },
    })

    // Count total reports
    const reportCount = await prisma.replyReport.count({
      where: { replyId: params.id },
    })

    return NextResponse.json({
      success: true,
      reportCount,
    })
  } catch (error) {
    console.error("Error reporting reply:", error)
    return NextResponse.json({ error: "Failed to report reply" }, { status: 500 })
  }
}