"use client"

import type React from "react"

import { useState } from "react"
import { FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa"
import { usersApi } from "@/lib/endpoints/users" // Import your API client
import { useRouter } from "next/navigation" // For redirecting after signup

export default function SignUpForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [gender, setGender] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Add state for loading and errors
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Form validation function
  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!username.trim()) errors.username = "Username is required"
    if (!email.trim()) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid"

    if (!password) errors.password = "Password is required"
    else if (password.length < 6) errors.password = "Password must be at least 6 characters"

    if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match"

    if (!gender) errors.gender = "Please select a gender"

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate form
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Map gender value to your enum format if needed
      const genderValue = gender === "male" ? "M" : gender === "female" ? "F" : gender

      // Call the API to create user
      const response = await usersApi.createUser({
        username,
        email,
        password,
        displayName: displayName || username, // Use username as displayName if not provided
        gender: genderValue,
        // Optional fields
        bio: "",
        profileImage: "",
      })

      // Successful signup
      console.log("User created successfully:", response)

      // Redirect to login page or dashboard
      router.push("/signin?registered=true")
    } catch (err: any) {
      console.error("Error during signup:", err)

      // Handle specific API errors
      if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError(err?.message || "An error occurred during signup")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-4 my-8">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg space-y-6">
        <div className="text-center">
          <h2 className="text-black dark:text-white text-2xl font-semibold mb-2">Create an Account</h2>
          <p className="text-gray-600 dark:text-gray-400">Sign up to access exclusive features and book tickets</p>
        </div>

        {/* Show general error message if any */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-800 dark:text-gray-300 mb-2 font-medium">Username</label>
            <input
              type="text"
              className={`w-full p-3 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border ${
                fieldErrors.username ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } focus:border-red-600 focus:outline-none`}
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {fieldErrors.username && <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>}
          </div>

          <div>
            <label className="block text-gray-800 dark:text-gray-300 mb-2 font-medium">Display Name</label>
            <input
              type="text"
              className={`w-full p-3 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border ${
                fieldErrors.displayName ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } focus:border-red-600 focus:outline-none`}
              placeholder="Enter your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            {fieldErrors.displayName && <p className="text-red-500 text-sm mt-1">{fieldErrors.displayName}</p>}
          </div>

          <div>
            <label className="block text-gray-800 dark:text-gray-300 mb-2 font-medium">Email</label>
            <input
              type="email"
              className={`w-full p-3 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border ${
                fieldErrors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } focus:border-red-600 focus:outline-none`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
          </div>

          <div className="relative">
            <label className="block text-gray-800 dark:text-gray-300 mb-2 font-medium">Password</label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full p-3 pr-10 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border ${
                  fieldErrors.password ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                } focus:border-red-600 focus:outline-none`}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {fieldErrors.password && <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>}
          </div>

          <div>
            <label className="block text-gray-800 dark:text-gray-300 mb-2 font-medium">Confirm Password</label>
            <input
              type="password"
              className={`w-full p-3 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border ${
                fieldErrors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } focus:border-red-600 focus:outline-none`}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {fieldErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>}
          </div>

          <div>
            <label className="block text-gray-800 dark:text-gray-300 mb-2 font-medium">Gender</label>
            <select
              className={`w-full p-3 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border ${
                fieldErrors.gender ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } focus:border-red-600 focus:outline-none`}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {fieldErrors.gender && <p className="text-red-500 text-sm mt-1">{fieldErrors.gender}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center gap-2 p-3 ${
              isLoading ? "bg-gray-500" : "bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600"
            } text-white rounded-lg transition font-medium`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Sign Up <FaUserPlus />
              </>
            )}
          </button>
        </form>

        <p className="text-gray-600 dark:text-gray-400 text-center pt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-red-600 dark:text-red-400 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

