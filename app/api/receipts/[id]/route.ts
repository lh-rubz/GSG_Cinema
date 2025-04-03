import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { TicketStatus } from "@prisma/client"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true,
          },
        },
        movie: true,
        tickets: {
          include: {
            seat: true,
            showtime: {
              include: {
                movie: true,
                screen: true,
              },
            },
          },
        },
      },
    })

    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
    }

    return NextResponse.json(receipt)
  } catch (error) {
    console.error("Error fetching receipt:", error)
    return NextResponse.json({ error: "Failed to fetch receipt" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const existingReceipt = await prisma.receipt.findUnique({
      where: { id: params.id },
    })

    if (!existingReceipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
    }

    const allowedUpdates = {
      paymentMethod: body.paymentMethod,
      totalPrice: body.totalPrice,
    }

    const receipt = await prisma.receipt.update({
      where: { id: params.id },
      data: allowedUpdates,
      include: {
        user: true,
        movie: true,
        tickets: true,
      },
    })

    return NextResponse.json(receipt)
  } catch (error) {
    console.error("Error updating receipt:", error)
    return NextResponse.json({ error: "Failed to update receipt" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { id: params.id },
      include: {
        tickets: true,
      },
    })

    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 })
    }

    await Promise.all(
      receipt.tickets.map(async (ticket) => {
        await prisma.ticket.update({
          where: { id: ticket.id },
          data: {
            receiptId: null,
            status: TicketStatus.reserved,
          },
        })
      }),
    )

    await prisma.receipt.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Receipt deleted successfully" })
  } catch (error) {
    console.error("Error deleting receipt:", error)
    return NextResponse.json({ error: "Failed to delete receipt" }, { status: 500 })
  }
}

