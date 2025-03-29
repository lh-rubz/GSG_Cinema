import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


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

    const directors = await prisma.director.findMany({
      where: whereClause,
      include: {
        movies: true, 
      },
    })

    return NextResponse.json(directors)
  } catch (error) {
    console.error("Error fetching directors:", error)
    return NextResponse.json({ error: "Failed to fetch directors" }, { status: 500 })
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const director = await prisma.director.create({
      data: body,
    })

    return NextResponse.json(director, { status: 201 })
  } catch (error) {
    console.error("Error creating director:", error)
    return NextResponse.json({ error: "Failed to create director" }, { status: 500 })
  }
}

