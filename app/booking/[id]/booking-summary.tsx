"use client"

import { useState } from "react"
import { Ticket, Trash2 } from 'lucide-react'
import { formatCurrency } from "@/lib/utils"
import { Seat } from "@/types/types"

interface BookingSummaryProps {
  showtime: any
  selectedSeats: Seat[]
  onBooking: () => void
  onRemoveSeat: (seatId: string) => void
}

export default function BookingSummary({ showtime, selectedSeats, onBooking, onRemoveSeat }: BookingSummaryProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const getSeatPrice = (seat: Seat) => {
    return seat.row === 0 ? 50 : showtime.price
  }

  const getRowLetter = (rowIndex: number) => {
    return String.fromCharCode(65 + rowIndex)
  }

  const getSeatLabel = (seat: Seat) => {
    return `${getRowLetter(seat.row)}${seat.col + 1}`
  }

  const handleBookNow = async () => {
    if (selectedSeats.length === 0) return

    setIsProcessing(true)
    try {
      await onBooking()
    } catch (error) {
      console.error("Booking failed:", error)
      alert("Failed to complete booking. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemoveSeat = (seatId: string) => {
    onRemoveSeat(seatId)
  }

  const handlePromoCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would validate the promo code with your backend
    if (promoCode === "MOVIE20") {
      setDiscount(20) // 20% discount
    } else {
      alert("Invalid promotion code")
    }
  }

  // Calculate totals
  const subtotal = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0)
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal - discountAmount

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 sticky top-[150px]">
      <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-white">Booking Summary</h2>

      <div className="mb-6">
        <h3 className="font-medium text-zinc-800 dark:text-zinc-200 mb-2">Movie</h3>
        <p className="text-zinc-600 dark:text-zinc-400">{showtime?.movie?.title || "Movie Title"}</p>
        <div className="flex gap-4 mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span>{showtime?.date}</span>
          <span>{showtime?.time}</span>
          <span>{showtime?.format}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-zinc-800 dark:text-zinc-200 mb-2">Selected Seats</h3>
        {selectedSeats.length > 0 ? (
          <div className="space-y-2">
            {selectedSeats.map((seat) => (
              <div key={seat.id} className="flex justify-between items-center p-2 bg-zinc-50 dark:bg-zinc-700 rounded">
                <div className="flex items-center">
                  <Ticket className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {getSeatLabel(seat)}
                  </span>
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    seat.type === "premium" 
                      ? "bg-amber-400 dark:bg-amber-600 text-amber-900 dark:text-amber-100" 
                      : "bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300"
                  }`}>
                    {seat.type}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-zinc-700 dark:text-zinc-300 mr-2">{formatCurrency(getSeatPrice(seat))}</span>
                  <button
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    onClick={() => handleRemoveSeat(seat.id)}
                    title="Remove seat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">No seats selected</p>
        )}
      </div>

      {selectedSeats.length > 0 && <div className="mb-6">
        <form onSubmit={handlePromoCodeSubmit} className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter promotion code"
            className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Apply
          </button>
        </form>
      </div>
}
      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-zinc-600 dark:text-zinc-400">Subtotal</span>
          <span className="text-zinc-800 dark:text-zinc-200">{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between mb-2">
            <span className="text-zinc-600 dark:text-zinc-400">Discount ({discount}%)</span>
            <span className="text-green-600 dark:text-green-500">-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold mt-4">
          <span className="text-zinc-800 dark:text-zinc-200">Total</span>
          <span className="text-red-600 dark:text-red-500">{formatCurrency(total)}</span>
        </div>
      </div>

      <button
        className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 
          ${selectedSeats.length === 0 || isProcessing
            ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700 text-white'
          } transition-colors duration-200`}
        disabled={selectedSeats.length === 0 || isProcessing}
        onClick={handleBookNow}
      >
        {isProcessing ? "Processing..." : "Continue Payment"}
      </button>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-4">
        By proceeding, you agree to our terms and conditions.
      </p>
    </div>
  )
}

