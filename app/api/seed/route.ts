import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Import your seed data
import { movies } from "@/data/movies"
import { directors } from "@/data/directors"
import { castMembers } from "@/data/cast"
import { users } from "@/data/users"
import { promotions } from "@/data/promotions"
import { screens } from "@/data/screens"
import { showtimes } from "@/data/showtimes"
import { reviews } from "@/data/reviews"
import { replies } from "@/data/replies"

export async function POST(request: NextRequest) {
  try {
    // Add basic authentication/protection
    const authHeader = request.headers.get("authorization")
    const expectedToken = process.env.SEED_SECRET || "your-secret-seed-token"
    
    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if data already exists to prevent duplicate seeding
    const existingMovies = await prisma.movie.count()
    if (existingMovies > 0) {
      return NextResponse.json({ 
        message: "Database already contains data. Skipping seed." 
      })
    }

    console.log("Starting database seeding...")

    // Seed in order (respecting foreign key constraints)
    
    // 1. Seed Directors
    await prisma.director.createMany({
      data: directors.map(director => ({
        id: director.id,
        name: director.name,
        bio: director.bio,
        image: director.image
      })),
      skipDuplicates: true
    })
    console.log("✅ Directors seeded")

    // 2. Seed Cast Members
    await prisma.castMember.createMany({
      data: castMembers.map(cast => ({
        id: cast.id,
        name: cast.name,
        character: cast.character,
        image: cast.image
      })),
      skipDuplicates: true
    })
    console.log("✅ Cast members seeded")

    // 3. Seed Movies
    await prisma.movie.createMany({
      data: movies.map(movie => ({
        id: movie.id,
        title: movie.title,
        year: movie.year,
        genre: movie.genre,
        rating: movie.rating,
        description: movie.description,
        image: movie.image,
        directorId: movie.directorId,
        duration: movie.duration,
        trailer: movie.trailer,
        releaseDate: movie.releaseDate,
        status: movie.status,
        hidden: movie.hidden
      })),
      skipDuplicates: true
    })
    console.log("✅ Movies seeded")

    // 4. Create Movie-Cast relationships
    for (const movie of movies) {
      if (movie.castIds && movie.castIds.length > 0) {
        await prisma.movieCast.createMany({
          data: movie.castIds.map(castId => ({
            movieId: movie.id,
            castMemberId: castId,
            character: "Actor" // Default character, you can make this more specific
          })),
          skipDuplicates: true
        })
      }
    }
    console.log("✅ Movie-Cast relationships seeded")

    // 5. Seed Users
    await prisma.user.createMany({
      data: users.map(user => ({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        email: user.email,
        password: user.password, // In production, these should be hashed
        gender: user.gender,
        profileImage: user.profileImage,
        role: user.role
      })),
      skipDuplicates: true
    })
    console.log("✅ Users seeded")

    // 6. Seed Screens
    await prisma.screen.createMany({
      data: screens.map(screen => ({
        id: screen.id,
        name: screen.name,
        type: screen.type,
        capacity: screen.capacity,
        rows: screen.rows,
        seatsPerRow: screen.seatsPerRow
      })),
      skipDuplicates: true
    })
    console.log("✅ Screens seeded")

    // 7. Seed Promotions
    await prisma.promotion.createMany({
      data: promotions.map(promotion => ({
        id: promotion.id,
        code: promotion.code,
        description: promotion.description,
        type: promotion.type,
        value: promotion.value,
        startDate: new Date(promotion.startDate),
        expiryDate: new Date(promotion.expiryDate),
        isActive: promotion.isActive,
        image: promotion.image
      })),
      skipDuplicates: true
    })
    console.log("✅ Promotions seeded")

    // 8. Seed Showtimes
    await prisma.showtime.createMany({
      data: showtimes.map(showtime => ({
        id: showtime.id,
        movieId: showtime.movieId,
        screenId: showtime.screenId,
        date: showtime.date,
        time: showtime.time,
        format: showtime.format,
        availableSeats: showtime.availableSeats,
        price: showtime.price
      })),
      skipDuplicates: true
    })
    console.log("✅ Showtimes seeded")

    // 9. Seed Reviews
    await prisma.review.createMany({
      data: reviews.map(review => ({
        id: review.id,
        userId: review.userId,
        movieId: review.movieId,
        rating: review.rating,
        comment: review.comment,
        date: new Date(review.date)
      })),
      skipDuplicates: true
    })
    console.log("✅ Reviews seeded")

    // 10. Seed Replies
    await prisma.reply.createMany({
      data: replies.map(reply => ({
        id: reply.id,
        userId: reply.userId,
        reviewId: reply.reviewId,
        comment: reply.comment,
        date: new Date(reply.date)
      })),
      skipDuplicates: true
    })
    console.log("✅ Replies seeded")

    console.log("🎉 Database seeding completed successfully!")

    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully" 
    })

  } catch (error) {
    console.error("❌ Seeding failed:", error)
    return NextResponse.json(
      { error: "Seeding failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to check seed status
export async function GET() {
  try {
    const counts = {
      movies: await prisma.movie.count(),
      directors: await prisma.director.count(),
      castMembers: await prisma.castMember.count(),
      users: await prisma.user.count(),
      screens: await prisma.screen.count(),
      promotions: await prisma.promotion.count(),
      showtimes: await prisma.showtime.count(),
      reviews: await prisma.review.count(),
      replies: await prisma.reply.count(),
    }

    return NextResponse.json({
      message: "Database status",
      counts,
      isEmpty: Object.values(counts).every(count => count === 0)
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check database status" },
      { status: 500 }
    )
  }
}
