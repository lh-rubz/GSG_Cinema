"use client"

import type React from "react"

import { useState } from "react"
import { FaUserPlus, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaVenusMars, FaInfoCircle } from "react-icons/fa"
import toast from "react-hot-toast"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

export default function SignUpForm() {
  const { signup, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    bio: "",
    displayName: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (!formData.gender) {
      toast.error("Please select your gender")
      return
    }

    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        bio: formData.bio,
        displayName: formData.displayName || formData.username,
      })
      toast.success("Account created successfully!")
    } catch (error) {
      // Error is already handled in the AuthContext
    }
  }

  return (
    <div className="min-h-full min-w-full flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-zinc-900">
      <div className="w-full max-w-md">
        {/* Card with subtle gradient border */}
        <div className="relative bg-white dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Top decorative accent */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
                <FaUserPlus size={24} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Create an Account</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">Join our cinema community today</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Two column layout for smaller fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Username*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-zinc-400 dark:text-zinc-500" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:border-transparent focus:outline-none transition-all"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Display Name */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Display Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-zinc-400 dark:text-zinc-500" />
                    </div>
                    <input
                      type="text"
                      name="displayName"
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:border-transparent focus:outline-none transition-all"
                      placeholder="Display Name"
                      value={formData.displayName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Email Address*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:border-transparent focus:outline-none transition-all"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Password*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:border-transparent focus:outline-none transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Must be at least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Confirm Password*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:border-transparent focus:outline-none transition-all"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Gender*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaVenusMars className="text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <select
                    name="gender"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:border-transparent focus:outline-none transition-all appearance-none"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-4 w-4 text-zinc-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Bio (Optional)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <FaInfoCircle className="text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <textarea
                    name="bio"
                    className="w-full resize-none pl-10 pr-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:border-transparent focus:outline-none transition-all"
                    placeholder="Tell us a bit about yourself..."
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    
                    
                  />
                </div>
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
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account <FaUserPlus />
                    </>
                  )}
                </button>
              </div>

              {/* Sign In Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors"
                  >
                    Sign in
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

