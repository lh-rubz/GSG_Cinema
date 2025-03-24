"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  username: string
  role: "admin" | "customer" | "user"
}

type AuthContextType = {
  user: User | null
  signIn: (username: string, password: string) => Promise<boolean>
  signUp: (username: string, password: string, role: "customer" | "user") => Promise<boolean>
  signOut: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("cinemax-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signIn = async (username: string, password: string): Promise<boolean> => {
    // Simple validation
    if (!username || !password) {
      return false
    }

    // For demo purposes, we'll accept any password
    // In a real app, you would validate against a backend

    // Special case for admin
    if (username === "hebaAdmin") {
      const userData: User = { username, role: "admin" }
      sessionStorage.setItem("cinemax-user", JSON.stringify(userData))
      setUser(userData)
      return true
    }

    // Check if user exists in session storage (for users who signed up)
    const storedUsers = sessionStorage.getItem("cinemax-users")
    const users = storedUsers ? JSON.parse(storedUsers) : {}

    if (users[username] && users[username].password === password) {
      const userData: User = {
        username,
        role: users[username].role,
      }
      sessionStorage.setItem("cinemax-user", JSON.stringify(userData))
      setUser(userData)
      return true
    }

    // For demo, create a default user if not found
    const userData: User = { username, role: "user" }
    sessionStorage.setItem("cinemax-user", JSON.stringify(userData))
    setUser(userData)
    return true
  }

  const signUp = async (username: string, password: string, role: "customer" | "user"): Promise<boolean> => {
    // Simple validation
    if (!username || !password) {
      return false
    }

    // Get existing users or initialize empty object
    const storedUsers = sessionStorage.getItem("cinemax-users")
    const users = storedUsers ? JSON.parse(storedUsers) : {}

    // Check if username already exists
    if (users[username]) {
      return false
    }

    // Add new user
    users[username] = { password, role }
    sessionStorage.setItem("cinemax-users", JSON.stringify(users))

    // Auto sign in after sign up
    const userData: User = { username, role }
    sessionStorage.setItem("cinemax-user", JSON.stringify(userData))
    setUser(userData)

    return true
  }

  const signOut = () => {
    sessionStorage.removeItem("cinemax-user")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

