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

    // Get all showtimes for this screen on this date
    const existingShowtimes = await prisma.showtime.findMany({
      where: {
        screenId: body.screenId,
        date: body.date,
      },
      include: {
        movie: true,
      },
    })

    // Convert showtime to minutes for comparison
    const [hours, minutes] = body.time.split(':').map(Number)
    const showtimeMinutes = hours * 60 + minutes

    // Check for conflicts with existing showtimes
    for (const existingShowtime of existingShowtimes) {
      const [existingHours, existingMinutes] = existingShowtime.time.split(':').map(Number)
      const existingShowtimeMinutes = existingHours * 60 + existingMinutes

      // Calculate the duration of the existing movie in minutes
      const existingMovieDuration = existingShowtime.movie.duration ? parseInt(existingShowtime.movie.duration) : 120 // Default to 2 hours if duration is not set
      const newMovieDuration = movie.duration ? parseInt(movie.duration) : 120 // Default to 2 hours if duration is not set

      // Check if the new showtime overlaps with the existing one
      if (
        (showtimeMinutes >= existingShowtimeMinutes && 
         showtimeMinutes < existingShowtimeMinutes + existingMovieDuration) ||
        (showtimeMinutes + newMovieDuration > existingShowtimeMinutes && 
         showtimeMinutes < existingShowtimeMinutes + existingMovieDuration)
      ) {
        // Calculate end time for the conflicting showtime
        const endTimeMinutes = existingShowtimeMinutes + existingMovieDuration
        const endHours = Math.floor(endTimeMinutes / 60)
        const endMinutes = endTimeMinutes % 60
        const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`

        return NextResponse.json({ 
          error: `Time conflict: There is already a showtime scheduled for this screen at ${existingShowtime.time} (${existingShowtime.movie.title}). The movie ends at ${endTime}. Please choose a time after ${endTime} or a different screen.` 
        }, { status: 400 })
      }
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

