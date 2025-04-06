// app/api/replies/[id]/unreport/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if the report exists
    const existingReport = await prisma.replyReport.findUnique({
      where: {
        replyId_userId: {
          replyId: params.id,
          userId,
        },
      },
    })

    if (!existingReport) {
      return NextResponse.json(
        { error: "You have not reported this reply" },
        { status: 400 }
      )
    }

    // Delete the report
    await prisma.replyReport.delete({
      where: {
        replyId_userId: {
          replyId: params.id,
          userId,
        },
      },
    })

    // Count remaining reports
    const reportCount = await prisma.replyReport.count({
      where: { replyId: params.id },
    })

    return NextResponse.json({
      success: true,
      reportCount,
    })
  } catch (error) {
    console.error("Error removing report:", error)
    return NextResponse.json({ error: "Failed to remove report" }, { status: 500 })
  }
}