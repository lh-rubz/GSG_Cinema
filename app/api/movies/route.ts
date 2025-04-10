import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { CastMember } from '@/types/types'
import { MovieGenre } from '@prisma/client'

type CastMemberInput = {
  castMemberId: string;
  character?: string;
}

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

    // Only filter by hidden if explicitly requested
    if (searchParams.has("hidden")) {
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
    const body = await request.json();
    
    // 1. Extract cast data and remove it from movieData
    const { cast = [], castIds, ...movieData } = body;

    // Add default character name for missing entries
    const processedCast = cast.map((member: CastMemberInput) => ({
      castMemberId: member.castMemberId,
      character: member.character || "Unknown Character" 
    }));

    // 2. Validate input format
    if (!Array.isArray(cast)) {
      return NextResponse.json(
        { error: "Cast must be an array of objects with castMemberId and character" },
        { status: 400 }
      );
    }

    // 3. Verify cast members exist
    const castMemberIds = processedCast.map((m: CastMemberInput) => m.castMemberId);
    const existingCast = await prisma.castMember.findMany({
      where: { id: { in: castMemberIds } }
    });

    if (existingCast.length !== castMemberIds.length) {
      return NextResponse.json(
        { error: "One or more cast members not found" },
        { status: 400 }
      );
    }

    // 4. Process genre to ensure it's a valid MovieGenre enum array
    let processedGenre: MovieGenre[] = [];
    if (Array.isArray(movieData.genre)) {
      processedGenre = movieData.genre.map((g: string) => {
        // Convert "Sci-Fi" to "SciFi" to match the enum
        if (g === "Sci-Fi") return MovieGenre.SciFi;
        // Try to match the genre to the enum
        return g as MovieGenre;
      });
    }

    // 5. Create movie with proper cast relation
    const movie = await prisma.movie.create({
      data: {
        ...movieData,
        genre: processedGenre,
        cast: {
          create: processedCast.map((member: CastMemberInput) => ({
            castMemberId: member.castMemberId,
            character: member.character
          }))
        }
      },
      include: {
        director: true,
        cast: {
          include: {
            castMember: true
          }
        }
      }
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error("Error creating movie:", error);
    return NextResponse.json(
      { error: "Failed to create movie" },
      { status: 500 }
    );
  }
}