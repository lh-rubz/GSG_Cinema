"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { showtimesApi } from "@/lib/endpoints/showtimes"
import { screensApi } from "@/lib/endpoints/screens"
import { receiptsApi } from "@/lib/endpoints/receipts"
import { Loading } from "@/components/loading-inline"
import { Seat } from "@/types/types"
import SeatMap from "./seat-map"
import BookingSummary from "./booking-summary"
import { ArrowLeft, Calendar, Clock, Film, Info } from 'lucide-react'
import Link from "next/link"

type BookingPageProps = {}

export default function BookingPage({}: BookingPageProps) {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id as string
  const date = searchParams.get("date")
  const time = searchParams.get("time")

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showtime, setShowtime] = useState<any>(null)
  const [screen, setScreen] = useState<any>(null)
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch showtime details
        const showtimeResponse = await showtimesApi.getShowtime(id)
        const showtimeData = showtimeResponse.data

        if (!showtimeData) {
          setError("Showtime not found")
          setIsLoading(false)
          return
        }

        setShowtime(showtimeData)

        // Fetch screen details
        const screenResponse = await screensApi.getScreen(showtimeData.screenId)
        const screenData = screenResponse.data

        if (!screenData) {
          setError("Screen information not available")
          setIsLoading(false)
          return
        }

        setScreen(screenData)
      } catch (err) {
        console.error("Failed to fetch booking data:", err)
        setError("Failed to load booking information. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleSeatSelect = (seat: Seat) => {
    setSelectedSeats((prev) => {
      // Check if seat is already selected
      const isSelected = prev.some((s) => s.id === seat.id)

      if (isSelected) {
        // Remove seat if already selected
        return prev.filter((s) => s.id !== seat.id)
      } else {
        // Add seat if not selected
        return [...prev, seat]
      }
    })
  }

  const handleRemoveSeat = (seatId: string) => {
    setSelectedSeats((prev) => prev.filter((seat) => seat.id !== seatId))
  }

  const getSeatPrice = (seat: Seat) => {
    return seat.row === 0 ? 50 : 30
  }

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat")
      return
    }

    try {
      // In a real app, you would create tickets first and then use their IDs
      // For now, we'll simulate this process
      const ticketIds = selectedSeats.map(seat => seat.id)
      const totalPrice = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0)
      
      // Create a receipt
      const receiptData = {
        userId: "current-user-id", // In a real app, get this from authentication
        movieId: showtime.movie.id,
        ticketIds: ticketIds,
        totalPrice: Number(totalPrice.toFixed(2)),
        paymentMethod: "credit_card",
        receiptDate: new Date().toISOString()
      }
      
      const response = await receiptsApi.createReceipt(receiptData)
      
      // Navigate to confirmation page with receipt ID
      router.push(`/booking/confirmation?receiptId=${response.data!.id}`)
    } catch (error) {
      console.error("Booking failed:", error)
      alert("Failed to complete booking. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen pt-[130px] bg-white dark:bg-zinc-900 flex items-center justify-center">
        <Loading text="Loading booking information..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-screen pt-[130px] bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/30 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-700 dark:text-red-300 text-lg font-medium">{error}</p>
          <Link
            href="/showtimes"
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Showtimes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 min-h-screen">
      <div className="pt-[130px] pb-16">
        {/* Header with movie info */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 dark:from-red-900 dark:to-red-700">
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Link href="/showtimes" className="inline-flex items-center text-white/80 hover:text-white mb-4 md:mb-0">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Showtimes
              </Link>

              <div className="md:ml-4">
                <h1 className="font-bold text-2xl md:text-3xl text-white flex items-center">
                  <Film className="mr-3 h-7 w-7 text-white" />
                  {showtime?.movie?.title || "Select Seats"}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-white/80">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{showtime.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{showtime.time}</span>
                  </div>
                  <div className="flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    <span>{screen?.name || "Screen"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 mt-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Seat selection area */}
            <div className="flex-grow">
              <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-white">Select Your Seats</h2>

                {/* Legend */}
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-700 mr-2"></div>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded bg-red-500 mr-2"></div>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Selected</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded bg-blue-300 dark:bg-blue-900 mr-2"></div>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Reserved</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded bg-amber-400 dark:bg-amber-600 mr-2"></div>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">Premium</span>
                  </div>
                </div>

                {/* Screen */}
                <div className="relative mb-12">
                  <div className="h-2 bg-zinc-300 dark:bg-zinc-600 rounded-lg w-full mb-1"></div>
                  <div className="h-8 bg-gradient-to-b from-zinc-300 to-transparent dark:from-zinc-600 rounded-t-lg w-3/4 mx-auto"></div>
                  <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 absolute -bottom-6 w-full">
                    SCREEN
                  </p>
                </div>

                {/* Seat Map */}
                {screen?.seatMap ? (
                  <SeatMap seatMap={screen.seatMap} selectedSeats={selectedSeats} onSeatSelect={handleSeatSelect} />
                ) : (
                  <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">Seat map not available</div>
                )}
              </div>
            </div>

            {/* Booking summary sidebar */}
            <div className="lg:w-96">
              <BookingSummary 
                showtime={showtime} 
                selectedSeats={selectedSeats} 
                onBooking={handleBooking} 
                onRemoveSeat={handleRemoveSeat}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

