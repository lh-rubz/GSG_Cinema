import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { Role } from "@prisma/client"

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
        role: true,
        password:true,
        username: true,
        displayName: true,
        bio: true,
        email: true,
        gender: true,
        profileImage: true,
        role: true,
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

    // Check if username already exists
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: body.username,
      },
    })

    if (existingUsername) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    })

    if (existingUser) {
      if (existingUser.username === body.username) {
        return NextResponse.json({ error: "Username already exists" }, { status: 400 })
      }
      if (existingUser.email === body.email) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 })
      }
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(body.password, 10)

    // Determine the role based on the request
    let role: Role = Role.User // Default role
    if (body.role === "Staff" || body.role === "staff") {
      role = Role.Staff
    } else if (body.role === "Admin" || body.role === "admin") {
      role = Role.Admin
    }

    const user = await prisma.user.create({
      data: {
        role: body.role || "User",  id:body.id,
        username: body.username,
        email: body.email,
        displayName: body.displayName,
        password: hashedPassword,
        gender: body.gender,
        bio: body.bio || null,
        profileImage: body.profileImage || null,
        role: role // Use the determined role
      },
    })

    // Remove password from the response
    const { password, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword, { status: 201 })
    
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create user" }, { status: 500 })
  }
}
