import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { userId, reason } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if reply exists
    const reply = await prisma.reply.findUnique({
      where: { id },
    })

    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 })
    }

    // Check if user has already reported this reply
    const existingReport = await (prisma as any).reportedContent.findFirst({
      where: {
        replyId: id,
        reporterId: userId,
      },
    })

    if (existingReport) {
      return NextResponse.json({ error: "You have already reported this reply" }, { status: 409 })
    }

    // Create the report
    await (prisma as any).reportedContent.create({
      data: {
        reporterId: userId,
        reason: reason || "Inappropriate content",
        reportDate: new Date().toISOString(),
        contentType: "REPLY",
        replyId: id,
        status: "PENDING",
      },
    })

    // Update the reply's reportedBy array
    const currentReportedBy = (reply as any).reportedBy || []
    await prisma.reply.update({
      where: { id },
      data: {
        reportedBy: [...currentReportedBy, userId],
      } as any,
    })

    return NextResponse.json({ message: "Reply reported successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error reporting reply:", error)
    return NextResponse.json({ error: "Failed to report reply" }, { status: 500 })
  }
}
