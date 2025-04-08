"use client"

import { useState } from "react"
import { Seat } from "@/types/types"
import { formatCurrency } from "@/lib/utils"

interface SeatMapProps {
  seatMap: Seat[][]
  selectedSeats: Seat[]
  onSeatSelect: (seat: Seat) => void
}

export default function SeatMap({ seatMap, selectedSeats, onSeatSelect }: SeatMapProps) {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null)

  const getSeatPrice = (seat: Seat) => {
    return seat.row === 0 ? 50 : 30
  }

  const getRowLetter = (rowIndex: number) => {
    return String.fromCharCode(65 + rowIndex)
  }

  const getSeatLabel = (seat: Seat) => {
    return `${getRowLetter(seat.row)}-${seat.column}`
  }

  const isSeatSelected = (seatId: string) => {
    return selectedSeats.some((seat) => seat.id === seatId)
  }

  const getSeatColor = (seat: Seat) => {
    if (isSeatSelected(seat.id)) {
      return "bg-red-500 hover:bg-red-600 text-white"
    }

    if (seat.available === false) {
      return "bg-blue-500 dark:bg-blue-600 cursor-not-allowed opacity-50"
    }

    if (seat.type === "premium") {
      return "bg-amber-400 dark:bg-amber-600 hover:bg-amber-500 dark:hover:bg-amber-500"
    }

    return "bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
  }

  const handleSeatClick = (seat: Seat) => {
    if (seat.available === false) {
      return // Don't allow selection of reserved seats
    }
    onSeatSelect(seat)
  }

  const handleSeatHover = (seatId: string | null) => {
    setHoveredSeat(seatId)
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-max">
        {seatMap.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center mb-2">
            <div className="w-8 text-center font-medium text-zinc-500 dark:text-zinc-400">
              {getRowLetter(rowIndex)}
            </div>
            <div className="flex gap-2">
              {row.map((seat, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-8 h-8 rounded-t-lg flex items-center justify-center text-xs font-medium
                    transition-colors duration-200
                    ${getSeatColor(seat)}
                    ${hoveredSeat === seat.id ? "ring-2 ring-red-400 dark:ring-red-500" : ""}
                  `}
                  disabled={seat.available === false}
                  onClick={() => handleSeatClick(seat)}
                  onMouseEnter={() => handleSeatHover(seat.id)}
                  onMouseLeave={() => handleSeatHover(null)}
                  title={`${getSeatLabel(seat)} - ${seat.type} - ${formatCurrency(getSeatPrice(seat))}`}
                >
                  {seat.column}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
