"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

import { getMovieById, getDirectorById, getCastMembersByIds, getShowtimesByMovieId, getReviewsByMovieId } from "@/lib/movie-data"
import { CastMember, Director, Movie, Review, Showtime } from "@/types/types"
import { MovieInfoTab } from "./components/info-tab"
import { MovieHeader } from "./components/movie-header"
import { MovieTabs } from "./components/movie-tabs"
import { ReviewsTab } from "./components/review-tab"
import { ShowtimesTab } from "./components/showtimes"
import { TrailerModal } from "./components/trailer"

export default function MovieDetailsPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [director, setDirector] = useState<Director | null>(null)
  const [cast, setCast] = useState<CastMember[]>([])
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [activeTab, setActiveTab] = useState("info")
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    const movieId = Array.isArray(id) ? id[0] : id
    const loadData = async () => {
      const movieData = getMovieById(movieId!)
      if (!movieData) return
      
      setMovie(movieData)
      setDirector(getDirectorById(movieData.directorId)!)
      setCast(getCastMembersByIds(movieData.castIds))
      setShowtimes(getShowtimesByMovieId(movieId!))
      setReviews(getReviewsByMovieId(movieId!))
    }
    loadData()
  }, [id])

  if (!movie) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <MovieHeader 
        movie={movie} 
        onTrailerClick={() => setShowTrailer(true)} 
      />
      
      <MovieTabs activeTab={activeTab} setActiveTab={setActiveTab} movieStatus={movie.status} />
      
      <div className="container mx-auto px-4 py-8">
        {activeTab === "info" && (
          <MovieInfoTab 
            movie={movie} 
            director={director} 
            cast={cast} 
          />
        )}
        
        {activeTab === "showtimes" && (
          <ShowtimesTab showtimes={showtimes} />
        )}
        
        {activeTab === "reviews" && (
          <ReviewsTab reviews={reviews} />
        )}
      </div>

      <TrailerModal 
        show={showTrailer} 
        onClose={() => setShowTrailer(false)} 
        trailerUrl={movie.trailer} 
        title={movie.title}
      />
    </div>
  )
}