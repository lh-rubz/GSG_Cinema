import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET: Fetch all cast members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get("name")

    const whereClause: any = {}

    if (name) {
      whereClause.name = {
        contains: name,
        mode: "insensitive",
      }
    }

    const castMembers = await prisma.castMember.findMany({
      where: whereClause,
      include: {
        movies: {
          include: {
            movie: true,
          },
        },
      },
    })

    const formattedCastMembers = castMembers.map((castMember) => ({
      ...castMember,
      movies: castMember.movies.map((cm) => ({
        movieId: cm.movieId,
        character: cm.character,
        movie: cm.movie,
      })),
    }))

    return NextResponse.json(formattedCastMembers)
  } catch (error) {
    console.error("Error fetching cast members:", error)
    return NextResponse.json({ error: "Failed to fetch cast members" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const castMember = await prisma.castMember.create({
      data: body,
    })

    return NextResponse.json(castMember, { status: 201 })
  } catch (error) {
    console.error("Error creating cast member:", error)
    return NextResponse.json({ error: "Failed to create cast member" }, { status: 500 })
  }
}

