import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const movieId = searchParams.get("movieId")
    const screenId = searchParams.get("screenId")
    const date = searchParams.get("date")

    const whereClause: any = {}

    if (movieId) {
      whereClause.movieId = movieId
    }

    if (screenId) {
      whereClause.screenId = screenId
    }

    if (date) {
      whereClause.date = date
    }

    const showtimes = await prisma.showtime.findMany({
      where: whereClause,
      include: {
        movie: true,
        screen: true,
        _count: {
          select: {
            tickets: true,
          },
        },
      },
    })

    return NextResponse.json(showtimes)
  } catch (error) {
    console.error("Error fetching showtimes:", error)
    return NextResponse.json({ error: "Failed to fetch showtimes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate that the movie and screen exist
    const movie = await prisma.movie.findUnique({
      where: { id: body.movieId },
    })

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 400 })
    }

    const screen = await prisma.screen.findUnique({
      where: { id: body.screenId },
    })

    if (!screen) {
      return NextResponse.json({ error: "Screen not found" }, { status: 400 })
    }

    const conflictingShowtime = await prisma.showtime.findFirst({
      where: {
        screenId: body.screenId,
        date: body.date,
        OR: [
          {
            // Check if the new showtime starts during an existing showtime
            time: {
              lte: body.time,
            },
            AND: {
              // Assuming each movie is ~2 hours, adjust as needed
              time: {
                gte: body.time,
              },
            },
          },
          {
            // Check if the new showtime ends during an existing showtime
            time: {
              gte: body.time,
            },
            AND: {
              // Assuming each movie is ~2 hours, adjust as needed
              time: {
                lte: body.time,
              },
            },
          },
        ],
      },
    })

    if (conflictingShowtime) {
      return NextResponse.json({ error: "Time conflict with another showtime on this screen" }, { status: 400 })
    }

    const showtime = await prisma.showtime.create({
      data: body,
      include: {
        movie: true,
        screen: true,
      },
    })

    return NextResponse.json(showtime, { status: 201 })
  } catch (error) {
    console.error("Error creating showtime:", error)
    return NextResponse.json({ error: "Failed to create showtime" }, { status: 500 })
  }
}

