import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'PENDING'

    // Fetch all reported content with related data
    const reports = await (prisma as any).reportedContent.findMany({
      where: {
        status: status,
      },
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true,
            profileImage: true,
          },
        },
        review: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                email: true,
                profileImage: true,
              },
            },
            movie: {
              select: {
                id: true,
                title: true,
                image: true,
              },
            },
          },
        },
        reply: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                email: true,
                profileImage: true,
              },
            },
            review: {
              include: {
                movie: {
                  select: {
                    id: true,
                    title: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        reportDate: 'desc',
      },
    })

    return NextResponse.json(reports, { status: 200 })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { reportId, action, adminId } = await request.json()

    if (!reportId || !action || !adminId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get the report first
    const report = await (prisma as any).reportedContent.findUnique({
      where: { id: reportId },
      include: {
        review: true,
        reply: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    switch (action) {
      case 'dismiss':
        // Just mark the report as dismissed
        await (prisma as any).reportedContent.update({
          where: { id: reportId },
          data: { status: 'DISMISSED' },
        })
        break

      case 'delete_comment':
        // Delete the comment and mark report as resolved
        if (report.contentType === 'REVIEW' && report.review) {
          await prisma.review.delete({ where: { id: report.reviewId } })
        } else if (report.contentType === 'REPLY' && report.reply) {
          await prisma.reply.delete({ where: { id: report.replyId } })
        }
        
        await (prisma as any).reportedContent.update({
          where: { id: reportId },
          data: { status: 'RESOLVED' },
        })
        break

      case 'delete_user_and_comment':
        // Delete the user and their comment, mark report as resolved
        let userIdToDelete = null
        
        if (report.contentType === 'REVIEW' && report.review) {
          userIdToDelete = report.review.userId
          await prisma.review.delete({ where: { id: report.reviewId } })
        } else if (report.contentType === 'REPLY' && report.reply) {
          userIdToDelete = report.reply.userId
          await prisma.reply.delete({ where: { id: report.replyId } })
        }

        if (userIdToDelete) {
          // Delete all user's content first due to foreign key constraints
          await prisma.review.deleteMany({ where: { userId: userIdToDelete } })
          await prisma.reply.deleteMany({ where: { userId: userIdToDelete } })
          await prisma.ticket.deleteMany({ where: { userId: userIdToDelete } })
          await prisma.receipt.deleteMany({ where: { userId: userIdToDelete } })
          await (prisma as any).reportedContent.deleteMany({ where: { reporterId: userIdToDelete } })
          
          // Finally delete the user
          await prisma.user.delete({ where: { id: userIdToDelete } })
        }
        
        await (prisma as any).reportedContent.update({
          where: { id: reportId },
          data: { status: 'RESOLVED' },
        })
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({ message: "Action completed successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error processing report action:", error)
    return NextResponse.json({ error: "Failed to process action" }, { status: 500 })
  }
}
