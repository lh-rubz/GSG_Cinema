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
    console.log('Promotion image URL:', promotion.image)
  }, [promotion.image])


  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(promotion.code)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!mounted) return null

  return (
    <div className="group border border-red-200 relative overflow-hidden rounded-xl bg-white transition-all duration-500 hover:translate-y-[-5px] hover:shadow-2xl dark:bg-black dark:shadow-red-900/20">
      {/* Cinema film strip top border */}
      <div className="absolute top-0 left-0 right-0 z-10 flex h-3 w-full">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="h-full w-[5%] bg-red-600 dark:bg-red-700" style={{ marginRight: "5%" }} />
        ))}
      </div>

      {/* Discount badge */}
      <div className="absolute right-0 top-6 z-10 flex items-center gap-1 rounded-l-full bg-red-600 px-4 py-1.5 text-sm font-bold text-white shadow-lg transition-transform duration-300 group-hover:translate-x-[-3px] dark:bg-red-700">
        <Ticket className="mr-1 h-3.5 w-3.5" />
        <span>
          {promotion.type === "PERCENTAGE" 
            ? `${promotion.value}% OFF`
            : promotion.type === "FIXED_AMOUNT"
            ? `$${promotion.value} OFF`
            : "BUY 1 GET 1"}
        </span>
      </div>

      {/* Image container */}
      <div className="relative h-48 w-full">
       
          <Image
            src={promotion.image?promotion.image:"./assets/BigSalePoster.png"}
            alt={promotion.description}
            fill
            className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-60"></div>

        {/* Cinema-style title overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 pt-8">
          <h2 className="text-xl font-bold text-white sm:text-2xl">{promotion.code}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="mb-4 text-zinc-700 line-clamp-2 dark:text-zinc-300">{promotion.description}</p>

        {/* Expiry date */}
        <div className="mb-5 flex items-center text-zinc-600 dark:text-zinc-400">
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-500" />
          <span className="text-sm">
            Valid until {formatDate(promotion.expiryDate)}
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

          {/* Copy code button */}
          <button
            onClick={handleCopyCode}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <span className="font-mono tracking-wider">{promotion.code}</span>
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;