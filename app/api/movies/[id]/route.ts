import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: params.id },
      include: {
        director: true,
        cast: {
          include: {
            castMember: true,
          },
        },
        reviews: {
          include: {
            user: true,
            replies: {
              include: {
                user: true,
              },
            },
            likedBy: {
              select: {
                id: true,
                username: true,
                displayName: true,
                profileImage: true,
              },
            },
          },
        },
        showtimes: {
          include: {
            screen: true,
          },
        },
      },
    })

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 })
    }

    const formattedMovie = {
      ...movie,
      castIds: movie.cast.map((c) => c.castMemberId),
    }

    return NextResponse.json(formattedMovie)
  } catch (error) {
    console.error("Error fetching movie:", error)
    return NextResponse.json({ error: "Failed to fetch movie" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { castIds, director, cast, ...movieData } = body

    // First update the movie without relations
    const updatedMovie = await prisma.movie.update({
      where: { id: params.id },
      data: {
        title: movieData.title,
        year: movieData.year,
        genre: movieData.genre,
        rating: movieData.rating,
        description: movieData.description,
        image: movieData.image,
        duration: movieData.duration || "",
        releaseDate: movieData.releaseDate,
        trailer: movieData.trailer,
        status: movieData.status,
        hidden: movieData.hidden,
      },
    })

    // Then handle cast updates if provided
    if (castIds && castIds.length > 0) {
      // Delete existing cast relations
      await prisma.castMovie.deleteMany({
        where: { movieId: params.id },
      })

      // Create new cast relations
      await Promise.all(
        castIds.map(async (castId: string) => {
          await prisma.castMovie.create({
            data: {
              movieId: params.id,
              castMemberId: castId,
              character: body.characters?.[castId] || "Unknown Character",
            },
          })
        }),
      )
    }

    // Fetch the updated movie with all relations
    const movie = await prisma.movie.findUnique({
      where: { id: params.id },
      include: {
        director: true,
        cast: {
          include: {
            castMember: true,
          },
        },
      },
    })

    return NextResponse.json(movie)
  } catch (error) {
    console.error("Error updating movie:", error)
    return NextResponse.json({ error: "Failed to update movie" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: params.id },
    })

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 })
    }

    await prisma.castMovie.deleteMany({
      where: { movieId: params.id },
    })

    const reviews = await prisma.review.findMany({
      where: { movieId: params.id },
      select: { id: true },
    })

    for (const review of reviews) {
      await prisma.reply.deleteMany({
        where: { reviewId: review.id },
      })
    }

    await prisma.review.deleteMany({
      where: { movieId: params.id },
    })

    const showtimes = await prisma.showtime.findMany({
      where: { movieId: params.id },
      select: { id: true },
    })

    for (const showtime of showtimes) {
      await prisma.ticket.deleteMany({
        where: { showtimeId: showtime.id },
      })
    }

    await prisma.showtime.deleteMany({
      where: { movieId: params.id },
    })

    await prisma.movie.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Movie deleted successfully" })
  } catch (error) {
    console.error("Error deleting movie:", error)
    return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 })
  }
}

