"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

import { CastMember, Director, Movie, EnrichedReview, Showtime } from "@/types/types"
import { MovieInfoTab } from "./components/info-tab"
import { MovieHeader } from "./components/movie-header"
import { MovieTabs } from "./components/movie-tabs"
import { ReviewsTab } from "./components/review-tab"
import { ShowtimesTab } from "./components/showtimes"
import { TrailerModal } from "./components/trailer"
import { moviesApi } from "@/lib/endpoints/movies"
import { Loading } from "@/components/loading-inline"
import MovieNotFound from "./error"
import { showtimesApi } from "@/lib/endpoints/showtimes"

export default function MovieDetailsPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [director, setDirector] = useState<Director | null>(null)
  const [cast, setCast] = useState<CastMember[]>([])
  const [showtimes, setShowtimes] = useState<Showtime[]|undefined>([])
  const [reviews, setReviews] = useState<EnrichedReview[]>([])
  const [activeTab, setActiveTab] = useState("info")
  const [showTrailer, setShowTrailer] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string>("") // TODO: Get from auth context

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setIsLoading(true)
        const movieId = Array.isArray(id) ? id[0] : id
        
        const response = await moviesApi.getMovie(movieId!)
        const movieData = response.data
        
        setMovie(movieData!)
        setDirector(movieData!.director)
        setCast(movieData!.cast.map(c => ({
          ...c.castMember,
          character: c.character
        })))
        setReviews(movieData!.reviews.map((review: any) => ({
          ...review,
          likes: review.likedBy.length
        })))
        
        
         const showtimesResponse = await showtimesApi.getShowtimes({ movieId: movieId! })
         setShowtimes(showtimesResponse.data) 
        
      } catch (err) {
      
        } finally {
        setIsLoading(false)
      }
    }

    if (id) fetchMovieData()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Loading movie details..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <MovieHeader 
        movie={movie!} 
        onTrailerClick={() => setShowTrailer(true)} 
      />
      
      <MovieTabs activeTab={activeTab} setActiveTab={setActiveTab} movieStatus={movie!.status} />
      
      <div className="container mx-auto px-4 py-8">
        {activeTab === "info" && (
          <MovieInfoTab 
            movie={movie!} 
            director={director!} 
            cast={cast} 
          />
        )}
        
        {activeTab === "showtimes" && (
          <ShowtimesTab showtimes={showtimes!} />
        )}
        
        {activeTab === "reviews" && (
          <ReviewsTab 
            reviews={reviews} 
            movieId={movie!.id}
            userId={userId}
          />
        )}
      </div>

      <TrailerModal 
        show={showTrailer} 
        onClose={() => setShowTrailer(false)} 
        trailerUrl={movie!.trailer} 
        title={movie!.title}
      />
    </div>
  )
}