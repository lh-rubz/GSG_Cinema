import { Movie, Director, CastMember } from "@/types/types"
import { InfoIcon, ChevronLeft, ChevronRight, EyeIcon } from "lucide-react"
import { MovieCast } from "./movie-cast"
import { CastIcon, DirectorIcon } from "./icons"
import { useState } from "react"
import Link from "next/link"

interface MovieInfoTabProps {
  movie: Movie
  director?: Director | null
  cast: CastMember[]
}

export function MovieInfoTab({ movie, director, cast }: MovieInfoTabProps) {
  const [currentCastIndex, setCurrentCastIndex] = useState(0)
  const castPerPage = 5

  const nextCast = () => {
    setCurrentCastIndex(prev => 
      Math.min(prev + 1, Math.ceil(cast.length / castPerPage) - 1
    ))
  }

  const prevCast = () => {
    setCurrentCastIndex(prev => Math.max(prev - 1, 0))
  }

  return (
    <div className="space-y-6">
      {/* Synopsis Section */}
      <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          <InfoIcon className="w-6 h-6 mr-2 text-red-600" />
          <h2 className="text-2xl font-bold">Synopsis</h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {movie.description}
        </p>
        
        {movie.releaseDate && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Release Date</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}
      </div>

  {/* Director Section */}
{director && (
  <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
    <div className="flex items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
      <DirectorIcon className="w-6 h-6 mr-2 text-red-600" />
      <h2 className="text-2xl font-bold">Director</h2>
    </div>
    <Link href={`/director/${director.id}`} className="group flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <div className="relative">
        <img 
          src={director.image}
          alt={director.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 group-hover:border-red-500 transition-all shadow-md"
        />
        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
          <EyeIcon className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white group-hover:text-red-500 transition-colors">
          {director.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
          {director.bio}
        </p>
        <span className="inline-block mt-2 text-sm text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
          View full profile →
        </span>
      </div>
    </Link>
  </div>
)}

      {/* Cast Section with Carousel */}
      <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <CastIcon className="w-6 h-6 mr-2 text-red-600" />
            <h2 className="text-2xl font-bold">Cast</h2>
          </div>
          
          {cast.length > castPerPage && (
            <div className="flex space-x-2">
              <button 
                onClick={prevCast}
                disabled={currentCastIndex === 0}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextCast}
                disabled={currentCastIndex >= Math.ceil(cast.length / castPerPage) - 1}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <MovieCast 
          cast={cast.slice(
            currentCastIndex * castPerPage,
            (currentCastIndex + 1) * castPerPage
          )} 
      
        />
      </div>
    </div>
  )
}