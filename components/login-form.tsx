"use client"

import type React from "react"

import { useState } from "react"
import { FaSignInAlt, FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa"
import Link from "next/link"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      // Handle login success or redirect
    }, 1000)
  }

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-zinc-900">
      <div className="w-full max-w-md">
        {/* Card with subtle gradient border */}
        <div className="relative bg-white dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Top decorative accent */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
                <FaSignInAlt size={24} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Welcome Back</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">Sign in to your account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:border-transparent focus:outline-none transition-all"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                  <a
                    href="#"
                    className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:border-transparent focus:outline-none transition-all"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-zinc-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:from-red-600 disabled:hover:to-red-700"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In <FaSignInAlt />
                    </>
                  )}
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

