"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { receiptsApi } from "@/lib/endpoints/receipts"
import { ArrowLeft, CheckCircle, Home, Ticket } from 'lucide-react'
import Link from "next/link"
import { Loading } from "@/components/loading-inline"
import { formatCurrency } from "@/lib/utils"

export default function ConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const receiptId = searchParams.get("receiptId")
  
  interface Receipt {
    id: string;
    movie: { title: string };
    receiptDate: string;
    tickets: {
      id: string;
      showtime: {
        date: string;
        time: string;
        screen: {
          name: string;
        };
      };
      seat: {
        id: string;
        row: number;
        column: number;
        number: number;
      };
    }[];
    paymentMethod: string;
    totalPrice: number;
  }

  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReceipt = async () => {
      if (!receiptId) {
        setError("Receipt ID not found")
        setIsLoading(false)
        return
      }
      
      try {
        setIsLoading(true)
        const response = await receiptsApi.getReceipt(receiptId)
        if (!response.data) {
          throw new Error("Failed to fetch receipt")
        }
        const receiptData = response.data as unknown as Receipt
        setReceipt(receiptData)
      } catch (err) {
        console.error("Failed to fetch receipt:", err)
        setError("Failed to load receipt information. Please check your booking history.")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchReceipt()
  }, [receiptId])

  if (isLoading) {
    return (
      <div className="w-full h-screen pt-[130px] bg-white dark:bg-zinc-900 flex items-center justify-center">
        <Loading text="Loading confirmation..." />
      </div>
    )
  }

  if (error || !receipt) {
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
          <p className="text-red-700 dark:text-red-300 text-lg font-medium">{error || "Receipt not found"}</p>
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

  // Format the receipt date
  const receiptDate = new Date(receipt.receiptDate)
  const formattedDate = receiptDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  
  const formattedTime = receiptDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 min-h-screen">
      <div className="pt-[130px] pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-500" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2">Booking Confirmed!</h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                Your tickets have been booked successfully. A confirmation has been sent to your email.
              </p>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-lg p-6 mb-8">
              <h2 className="font-medium text-lg mb-4 text-zinc-800 dark:text-zinc-200">Booking Details</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Movie</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium">{receipt.movie.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Date & Time</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                    {receipt.tickets[0]?.showtime?.date} • {receipt.tickets[0]?.showtime?.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Screen</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                    {receipt.tickets[0]?.showtime?.screen?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Seats</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                    {receipt.tickets.map(ticket => ticket.seat.number).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Payment Method</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                    {receipt.paymentMethod === "cash" ? "Cash" : "Credit Card"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Total Amount</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium">{formatCurrency(receipt.totalPrice)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link 
                href="/tickets"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                View My Tickets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

