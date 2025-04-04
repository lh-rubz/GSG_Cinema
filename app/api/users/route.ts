import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const email = searchParams.get("email")

    const whereClause: any = {}

    if (username) {
      whereClause.username = {
        contains: username,
        mode: "insensitive",
      }
    }

    if (email) {
      whereClause.email = {
        contains: email,
        mode: "insensitive",
      }
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        email: true,
        gender: true,
        profileImage: true,
        // Include counts of related entities
        _count: {
          select: {
            reviews: true,
            tickets: true,
            receipts: true,
          },
        },
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.email }],
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Username or email already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const user = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        displayName: body.displayName,
        password: hashedPassword,
        gender: body.gender,
        bio: body.bio || null,
        profileImage: body.profileImage || null,
      },
    })

    const { password, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword, { status: 201 })
    
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

