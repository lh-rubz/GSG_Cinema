import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { userId, reason } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id },
    })

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Check if user has already reported this review
    const existingReport = await (prisma as any).reportedContent.findFirst({
      where: {
        reviewId: id,
        reporterId: userId,
      },
    })

    if (existingReport) {
      return NextResponse.json({ error: "You have already reported this review" }, { status: 409 })
    }

    // Create the report
    await (prisma as any).reportedContent.create({
      data: {
        reporterId: userId,
        reason: reason || "Inappropriate content",
        reportDate: new Date().toISOString(),
        contentType: "REVIEW",
        reviewId: id,
        status: "PENDING",
      },
    })

    // Update the review's reportedBy array
    const currentReportedBy = (review as any).reportedBy || []
    await prisma.review.update({
      where: { id },
      data: {
        reportedBy: [...currentReportedBy, userId],
      } as any,
    })

    return NextResponse.json({ message: "Review reported successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error reporting review:", error)
    return NextResponse.json({ error: "Failed to report review" }, { status: 500 })
  }
}
