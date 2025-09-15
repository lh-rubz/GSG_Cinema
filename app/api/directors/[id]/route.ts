import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const director = await prisma.director.findUnique({
      where: { id: id },
      include: {
        movies: true, 
      },
    })

    if (!director) {
      return NextResponse.json({ error: "Director not found" }, { status: 404 })
    }

    return NextResponse.json(director)
  } catch (error) {
    console.error("Error fetching director:", error)
    return NextResponse.json({ error: "Failed to fetch director" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const director = await prisma.director.update({
      where: { id: id },
      data: body,
    })

    return NextResponse.json(director)
  } catch (error) {
    console.error("Error updating director:", error)
    return NextResponse.json({ error: "Failed to update director" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const moviesCount = await prisma.movie.count({
      where: { directorId: id },
    })

    if (moviesCount > 0) {
      return NextResponse.json({ error: "Cannot delete director with associated movies" }, { status: 400 })
    }

    await prisma.director.delete({
      where: { id: id },
    })

    return NextResponse.json({ message: "Director deleted successfully" })
  } catch (error) {
    console.error("Error deleting director:", error)
    return NextResponse.json({ error: "Failed to delete director" }, { status: 500 })
  }
}

