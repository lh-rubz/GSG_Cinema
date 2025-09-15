import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const totalMovies = await prisma.movie.count()

    const activeCustomers = await prisma.user.count({
      where: {
        role: "User"
      }
    })

    const ticketsSold = await prisma.ticket.count({
      where: {
        status: {
          in: ["paid", "used"]
        }
      }
    })

    const revenue = await prisma.receipt.aggregate({
      _sum: {
        totalPrice: true
      }
    })

    // Calculate all-time trends based on historical data
    const firstReceipt = await prisma.receipt.findFirst({
      orderBy: {
        receiptDate: 'asc'
      }
    })

    const firstTicket = await prisma.ticket.findFirst({
      orderBy: {
        purchaseDate: 'asc'
      }
    })

    // Calculate growth rate based on time period
    let revenueTrend = 0
    let ticketsTrend = 0

    if (firstReceipt && revenue._sum.totalPrice) {
      const daysSinceFirst = Math.max(
        1,
        Math.floor((new Date().getTime() - new Date(firstReceipt.receiptDate).getTime()) / (1000 * 60 * 60 * 24))
      )
      
      // Calculate annualized growth rate
      const monthlyGrowthRate = (revenue._sum.totalPrice / Math.max(daysSinceFirst / 30, 1)) * 100
      revenueTrend = Math.min(monthlyGrowthRate, 999) // Cap at 999% for display
    }

    if (firstTicket && ticketsSold > 0) {
      const daysSinceFirstTicket = Math.max(
        1,
        Math.floor((new Date().getTime() - new Date(firstTicket.purchaseDate).getTime()) / (1000 * 60 * 60 * 24))
      )
      
      // Calculate tickets sold per month trend
      const monthlyTicketRate = (ticketsSold / Math.max(daysSinceFirstTicket / 30, 1)) * 10
      ticketsTrend = Math.min(monthlyTicketRate, 999) // Cap at 999% for display
    }

    return NextResponse.json({
      totalMovies,
      activeCustomers,
      ticketsSold,
      revenue: revenue._sum.totalPrice || 0,
      ticketsTrend: Math.round(ticketsTrend),
      revenueTrend: Math.round(revenueTrend)
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
} 