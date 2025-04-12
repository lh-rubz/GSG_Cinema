"use client"

import { useState } from "react"
import { Ticket, Trash2, Tag } from 'lucide-react'
import { Seat } from "@/types/types"
import { usePreferences } from "@/context/PreferencesContext"
import { formatCurrency } from "@/utils/formatters"

interface BookingSummaryProps {
  showtime: any
  selectedSeats: Seat[]
  onBooking: (promotionData: { promotion: any; discountAmount: number; finalPrice: number } | null) => void
  onRemoveSeat: (seatId: string) => void
}

export default function BookingSummary({ showtime, selectedSeats, onBooking, onRemoveSeat }: BookingSummaryProps) {
  const [promotionCode, setPromotionCode] = useState("")
  const [promotionError, setPromotionError] = useState<string | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [appliedPromotion, setAppliedPromotion] = useState<any>(null)
  const { preferences } = usePreferences();

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + showtime.price, 0)
  const finalPrice = totalPrice - discountAmount

  const handleApplyPromotion = async () => {
    try {
      setPromotionError(null)
      
      const response = await fetch("/api/promotions/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: promotionCode,
          showtimeId: showtime.id,
          totalPrice,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to apply promotion")
      }

      setDiscountAmount(data.discountAmount)
      setAppliedPromotion(data.promotion)
    } catch (error) {
      setPromotionError(error instanceof Error ? error.message : "Failed to apply promotion")
      setDiscountAmount(0)
      setAppliedPromotion(null)
    }
  }

  const handleBookingClick = () => {
    onBooking(appliedPromotion ? {
      promotion: appliedPromotion,
      discountAmount,
      finalPrice
    } : null)
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Booking Summary</h3>
      
      <div className="space-y-4">
        {/* Selected Seats */}
        <div>
          <h4 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Selected Seats</h4>
          <div className="space-y-2">
            {selectedSeats.map((seat) => (
              <div key={seat.id} className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-700 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-red-500 dark:text-red-400" />
                  <span className="text-zinc-900 dark:text-white">Seat {seat.number}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-zinc-900 dark:text-white">{formatCurrency(showtime.price,preferences.currency)}</span>
                  <button
                    onClick={() => onRemoveSeat(seat.id)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promotion Code */}
        <div>
          <h4 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Promotion Code</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={promotionCode}
              onChange={(e) => setPromotionCode(e.target.value.toUpperCase())}
              placeholder="Enter promotion code"
              className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-zinc-700 dark:text-white"
            />
            <button
              onClick={handleApplyPromotion}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <Tag className="w-4 h-4" />
              Apply
            </button>
          </div>
          {promotionError && (
            <p className="mt-2 text-sm text-red-500">{promotionError}</p>
          )}
        </div>

        {/* Price Summary */}
        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-zinc-700 dark:text-zinc-300">Subtotal</span>
            <span className="text-zinc-900 dark:text-white">{formatCurrency(totalPrice,preferences.currency)}</span>
          </div>
          {appliedPromotion && (
            <div className="flex justify-between items-center mb-2 text-green-600 dark:text-green-400">
              <span>Discount</span>
              <span>-{formatCurrency(discountAmount,preferences.currency)}</span>
            </div>
          )}
          <div className="flex justify-between items-center font-bold">
            <span className="text-zinc-900 dark:text-white">Total</span>
            <span className="text-red-600 dark:text-red-400">{formatCurrency(finalPrice,preferences.currency)}</span>
          </div>
        </div>

        {/* Book Now Button */}
        <button
          onClick={handleBookingClick}
          disabled={selectedSeats.length === 0}
          className="w-full mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Book Now
        </button>
      </div>
    </div>
  )
}

