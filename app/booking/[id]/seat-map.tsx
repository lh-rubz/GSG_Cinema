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
    return seat.type === 'premium' ? 50 : 30;
  };

  const getRowLetter = (rowIndex: number) => {
    return String.fromCharCode(65 + rowIndex);
  };

  const getSeatLabel = (seat: Seat) => {
    return `${getRowLetter(seat.row)}${seat.col + 1}`;
  };

  const getSeatColor = (seat: Seat) => {
    if (!seat.available) return 'bg-blue-500 dark:bg-blue-600';
    if (selectedSeats.some(s => s.id === seat.id)) return 'bg-red-500 dark:bg-red-600';
    return seat.type === 'premium' ? 'bg-amber-400 dark:bg-amber-600' : 'bg-zinc-200 dark:bg-zinc-700';
  };

  const handleSeatClick = (seat: Seat) => {
    if (!seat.available) return;
    onSeatSelect(seat);
  };

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
                  key={colIndex}
                  onClick={() => handleSeatClick(seat)}
                  disabled={!seat.available}
                  className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors duration-200
                    ${getSeatColor(seat)}
                    ${!seat.available ? 'cursor-not-allowed opacity-50' : 'hover:opacity-80'}
                    ${selectedSeats.some(s => s.id === seat.id) ? 'ring-2 ring-red-500 dark:ring-red-400' : ''}
                  `}
                >
                  {/* Removed the seat number */}
                </button>
              ))}
            </div>
          </div>
        ))}
        
        {/* Column numbers */}
        <div className="flex items-center pl-8 mt-2">
          {seatMap[0]?.map((_, colIndex) => (
            <div key={colIndex} className="w-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              {colIndex + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
