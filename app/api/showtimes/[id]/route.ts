import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get the ID from the params object
    const { id } = params
    
    const showtime = await prisma.showtime.findUnique({
      where: { id },
      include: {
        movie: true,
        screen: true,
        tickets: {
          include: {
            seat: true,
            user: true,
          },
        },
      },
    })

    if (!showtime) {
      return NextResponse.json({ error: "Showtime not found" }, { status: 404 })
    }

    return NextResponse.json(showtime)
  } catch (error) {
    console.error("Error fetching showtime:", error)
    return NextResponse.json({ error: "Failed to fetch showtime" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    
    // Get the ID from the params object
    const { id } = params

    // Check if the showtime exists
    const existingShowtime = await prisma.showtime.findUnique({
      where: { id },
      include: {
        movie: true,
      },
    })

    if (!existingShowtime) {
      return NextResponse.json({ error: "Showtime not found" }, { status: 404 })
    }

    // If changing screen, date, or time, check for conflicts
    if (
      (body.screenId && body.screenId !== existingShowtime.screenId) ||
      (body.date && body.date !== existingShowtime.date) ||
      (body.time && body.time !== existingShowtime.time)
    ) {
      // Get the movie for the new showtime
      const movie = await prisma.movie.findUnique({
        where: { id: body.movieId || existingShowtime.movieId },
      })

      if (!movie) {
        return NextResponse.json({ error: "Movie not found" }, { status: 400 })
      }

      // Get all showtimes for this screen on this date
      const otherShowtimes = await prisma.showtime.findMany({
        where: {
          screenId: body.screenId || existingShowtime.screenId,
          date: body.date || existingShowtime.date,
          NOT: {
            id,
          },
        },
        include: {
          movie: true,
        },
      })

      // Convert showtime to minutes for comparison
      const [hours, minutes] = (body.time || existingShowtime.time).split(':').map(Number)
      const showtimeMinutes = hours * 60 + minutes

      // Check for conflicts with other showtimes
      for (const otherShowtime of otherShowtimes) {
        const [otherHours, otherMinutes] = otherShowtime.time.split(':').map(Number)
        const otherShowtimeMinutes = otherHours * 60 + otherMinutes

        // Calculate the duration of the other movie in minutes
        const otherMovieDuration = otherShowtime.movie.duration ? parseInt(otherShowtime.movie.duration) : 120 // Default to 2 hours if duration is not set
        const newMovieDuration = movie.duration ? parseInt(movie.duration) : 120 // Default to 2 hours if duration is not set

        // Check if the showtimes overlap
        if (
          (showtimeMinutes >= otherShowtimeMinutes && 
           showtimeMinutes < otherShowtimeMinutes + otherMovieDuration) ||
          (showtimeMinutes + newMovieDuration > otherShowtimeMinutes && 
           showtimeMinutes < otherShowtimeMinutes + otherMovieDuration)
        ) {
          // Calculate end time for the conflicting showtime
          const endTimeMinutes = otherShowtimeMinutes + otherMovieDuration
          const endHours = Math.floor(endTimeMinutes / 60)
          const endMinutes = endTimeMinutes % 60
          const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`

          return NextResponse.json({ 
            error: `Time conflict: There is already a showtime scheduled for this screen at ${otherShowtime.time} (${otherShowtime.movie.title}). The movie ends at ${endTime}. Please choose a time after ${endTime} or a different screen.` 
          }, { status: 400 })
        }
      }
    }

    const showtime = await prisma.showtime.update({
      where: { id },
      data: body,
      include: {
        movie: true,
        screen: true,
      },
    })

    return NextResponse.json(showtime)
  } catch (error) {
    console.error("Error updating showtime:", error)
    return NextResponse.json({ error: "Failed to update showtime" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get the ID from the params object
    const { id } = params
    
    // Check if there are any tickets for this showtime
    const ticketsCount = await prisma.ticket.count({
      where: { showtimeId: id },
    })

    if (ticketsCount > 0) {
      return NextResponse.json({ error: "Cannot delete showtime with existing tickets" }, { status: 400 })
    }

    await prisma.showtime.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Showtime deleted successfully" })
  } catch (error) {
    console.error("Error deleting showtime:", error)
    return NextResponse.json({ error: "Failed to delete showtime" }, { status: 500 })
  }
}

