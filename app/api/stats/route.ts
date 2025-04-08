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

    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const lastMonthStr = lastMonth.toISOString().split('T')[0]

    const lastMonthTickets = await prisma.ticket.count({
      where: {
        status: {
          in: ["paid", "used"]
        },
        purchaseDate: {
          lt: lastMonthStr
        }
      }
    })

    const lastMonthRevenue = await prisma.receipt.aggregate({
      where: {
        receiptDate: {
          lt: lastMonthStr
        }
      },
      _sum: {
        totalPrice: true
      }
    })

    const ticketsTrend = lastMonthTickets > 0 
      ? ((ticketsSold - lastMonthTickets) / lastMonthTickets) * 100 
      : 100

    const revenueTrend = lastMonthRevenue._sum.totalPrice && revenue._sum.totalPrice
      ? ((revenue._sum.totalPrice - lastMonthRevenue._sum.totalPrice) / lastMonthRevenue._sum.totalPrice) * 100 
      : 100

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