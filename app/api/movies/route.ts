import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const genre = searchParams.get("genre")
    const status = searchParams.get("status")
    const hidden = searchParams.get("hidden") === "true"
    const year = searchParams.get("year")
    const directorId = searchParams.get("directorId")

    const whereClause: any = {}

    if (genre) {
      whereClause.genre = {
        has: genre,
      }
    }

    if (status) {
      whereClause.status = status
    }

    if (!hidden) {
      whereClause.hidden = false
    } else {
      whereClause.hidden = hidden
    }

    if (year) {
      whereClause.year = year
    }

    if (directorId) {
      whereClause.directorId = directorId
    }

    const movies = await prisma.movie.findMany({
      where: whereClause,
      include: {
        director: true,
        cast: {
          include: {
            castMember: true,
          },
        },
      },
    })

    const formattedMovies = movies.map((movie) => ({
      ...movie,
      castIds: movie.cast.map((c) => c.castMemberId),
    }))

    return NextResponse.json(formattedMovies)
  } catch (error) {
    console.error("Error fetching movies:", error)
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 })
  }
}

// export async function GET(request: NextRequest){
//     try{
//         const allMovies = await prisma.movie.findMany({
//             include: {
//                 director: true,
//                 // genre: true,
//                 showtimes: true
//             },
//             orderBy: {
//                 releaseDate: 'desc'
//             }
//         })

//         return NextResponse.json(allMovies, { status: 200 })
//     } catch (error) {
//         console.error("Error fetching movies:", error);
//         return NextResponse.json("Faild to fetch movies", {status: 500});
//     }
// }


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { castIds, ...movieData } = body

    const movie = await prisma.movie.create({
      data: {
        ...movieData,
        ...(castIds && castIds.length > 0
          ? {
              cast: {
                create: castIds.map((castId: string) => ({
                  castMember: {
                    connect: { id: castId },
                  },
                  character: body.characters?.[castId] || "Unknown Character",
                })),
              },
            }
          : {}),
      },
      include: {
        director: true,
        cast: {
          include: {
            castMember: true,
          },
        },
      },
    })

    return NextResponse.json(movie, { status: 201 })
  } catch (error) {
    console.error("Error creating movie:", error)
    return NextResponse.json({ error: "Failed to create movie" }, { status: 500 })
  }
}

