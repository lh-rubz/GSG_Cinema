import Image from "next/image"
import { useState } from "react"
import { Movie } from "@/types/types"
import { ClockIcon, PlayIcon } from "lucide-react"
import { StarRating } from "./star-rating"
import { formatDuration } from "@/utils/formatters"
import { usePreferences } from "@/context/PreferencesContext"

interface MovieHeaderProps {
  movie: Movie
  onTrailerClick: () => void
}

export function MovieHeader({ movie, onTrailerClick }: MovieHeaderProps) {
  const [showHoursFormat, setShowHoursFormat] = useState(false)
  const statusBadge = movie.status === "now_showing" 
    ? { text: "Now Showing", color: "bg-green-600" } 
    : { text: "Coming Soon", color: "bg-red-600" }
    const { preferences } = usePreferences();

 

  return (
    <div 
      className="w-full h-[60vh] bg-cover bg-center relative"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${movie.image})` }}
    >
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-8">
          <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
            <div className="relative">
              <Image
                src={movie.image!}
                alt={movie.title}
                width={300}
                height={450}
                className="w-40 h-60 object-cover rounded-lg shadow-2xl border-4 border-white dark:border-zinc-800"
              />
              <span className={`absolute top-0 right-0 ${statusBadge.color} text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg`}>
                {statusBadge.text}
              </span>
            </div>
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {movie.title} <span className="text-2xl font-normal opacity-80">({movie.year})</span>
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genre.map((genre) => (
                  <span key={genre} className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {movie.status === "now_showing" && (
                  <span className="flex items-center">
                    <StarRating rating={parseFloat(movie.rating)/2} />
                    {movie.rating}/10
                  </span>
                )}
                {movie.duration && (
                  <button 
                    onClick={() => setShowHoursFormat(!showHoursFormat)}
                    className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <ClockIcon className="w-5 h-5 mr-1" />
                    {formatDuration(Number(movie.duration), preferences.durationFormat)}
                  </button>
                )}
                {movie.releaseDate && (
                  <span className="flex items-center">
                    {new Date(movie.releaseDate).toLocaleDateString()}
                  </span>
                )}
                <button
                  onClick={onTrailerClick}
                  className="flex items-center bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded-full"
                  disabled={!movie.trailer}
                >
                  <PlayIcon className="w-5 h-5 mr-2" />
                  {movie.trailer ? "Watch Trailer" : "Trailer Coming Soon"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}