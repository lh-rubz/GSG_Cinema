import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const castMember = await prisma.castMember.findUnique({
      where: { id: id },
      include: {
        movies: {
          include: {
            movie: true,
          },
        },
      },
    })

    if (!castMember) {
      return NextResponse.json({ error: "Cast member not found" }, { status: 404 })
    }

    const formattedCastMember = {
      ...castMember,
      movies: castMember.movies.map((cm) => ({
        movieId: cm.movieId,
        character: cm.character,
        movie: cm.movie,
      })),
    }

    return NextResponse.json(formattedCastMember)
  } catch (error) {
    console.error("Error fetching cast member:", error)
    return NextResponse.json({ error: "Failed to fetch cast member" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { character, movieId } = body

    if (!movieId) {
      return NextResponse.json({ error: "Movie ID is required" }, { status: 400 })
    }

    // Update the character in the CastMovie table
    const castMovie = await prisma.castMovie.update({
      where: {
        castMemberId_movieId: {
          castMemberId: id,
          movieId: movieId
        }
      },
      data: {
        character: character
      },
      include: {
        castMember: true,
        movie: true
      }
    })

    return NextResponse.json(castMovie)
  } catch (error) {
    console.error("Error updating cast member character:", error)
    return NextResponse.json({ error: "Failed to update cast member character" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.castMovie.deleteMany({
      where: { castMemberId: id },
    })

    await prisma.castMember.delete({
      where: { id: id },
    })

    return NextResponse.json({ message: "Cast member deleted successfully" })
  } catch (error) {
    console.error("Error deleting cast member:", error)
    return NextResponse.json({ error: "Failed to delete cast member" }, { status: 500 })
  }
}

