"use client"

import type { Promotion } from "@/types/types"
import Image from "next/image"
import { CalendarIcon, Copy, Check, Ticket } from "lucide-react"
import { useState, useEffect } from "react"
import { parseDDMMYYYY } from "@/functions"

interface Iprops {
  promotion: Promotion
}

const PromotionCard = ({ promotion }: Iprops) => {
  const [isCopied, setIsCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch with dark mode
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promotion.discount_code)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }



  // Format date for display
  const formatDate = (dateString: string) => {
    const date = parseDDMMYYYY(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!mounted) return null

  return (
    <div className="group border-1 border-red-200 relative overflow-hidden rounded-xl bg-white transition-all duration-500 hover:translate-y-[-5px] hover:shadow-2xl dark:bg-black dark:shadow-red-900/20">
      {/* Cinema film strip top border */}
      <div className="absolute top-0 left-0 right-0 z-10 flex h-3 w-full">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="h-full w-[5%] bg-red-600 dark:bg-red-700" style={{ marginRight: "5%" }} />
        ))}
      </div>

      {/* Discount badge */}
      <div className="absolute right-0 top-6 z-10 flex items-center gap-1 rounded-l-full bg-red-600 px-4 py-1.5 text-sm font-bold text-white shadow-lg transition-transform duration-300 group-hover:translate-x-[-3px] dark:bg-red-700">
        <Ticket className="mr-1 h-3.5 w-3.5" />
        <span>{promotion.discount_percentage}% OFF</span>
      </div>

      {/* Image container */}
      <div className="relative mt-3 h-56 w-full overflow-hidden sm:h-64">
        <Image
          src={promotion.image_url || "/placeholder.svg"}
          alt={promotion.title}
          fill
          className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-60"></div>

        {/* Cinema-style title overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 pt-8">
          <h2 className="text-xl font-bold text-white sm:text-2xl">{promotion.title}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6">
        <p className="mb-4 text-gray-700 line-clamp-2 dark:text-gray-300">{promotion.description}</p>

        {/* Expiry date - now using the formatDate function */}
        <div className="mb-5 flex items-center text-gray-600 dark:text-gray-400">
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-500" />
          <span className="text-sm">
            Valid until {formatDate(promotion.expiry_date)}
          </span>
        </div>

        {/* Discount code - styled like a cinema ticket */}
        <div className="relative mt-4 overflow-hidden rounded-lg border-2 border-dashed border-red-200 bg-white shadow-sm transition-all duration-300 group-hover:shadow-md dark:border-red-900 dark:bg-black">
          {/* Ticket holes */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around px-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-2 w-2 rounded-full bg-red-100 dark:bg-red-900" />
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-around px-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-2 w-2 rounded-full bg-red-100 dark:bg-red-900" />
            ))}
          </div>

          <div className="flex items-center justify-between mr-5">
            <div className="w-full px-6 py-3">
              <div className="text-xs uppercase tracking-wider text-red-600 dark:text-red-500">Cinema Promo</div>
              <div className="font-mono text-lg font-bold text-gray-900 dark:text-white">{promotion.discount_code}</div>
            </div>
            <button
              onClick={handleCopyCode}
              className="rounded-lg relative h-full overflow-hidden bg-red-600 px-5 py-5 text-white transition-all duration-300 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
              aria-label="Copy discount code"
            >
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isCopied ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              >
                <Check className="h-5 w-5" />
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isCopied ? "translate-y-[-10px] opacity-0" : "translate-y-0 opacity-100"}`}
              >
                <Copy className="h-5 w-5" />
              </span>
            </button>
          </div>
        </div>

        {/* Cinema film strip bottom border */}
        <div className="absolute bottom-0 left-0 right-0 flex h-3 w-full">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="h-full w-[5%] bg-red-600 dark:bg-red-700" style={{ marginRight: "5%" }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PromotionCard