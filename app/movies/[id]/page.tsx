import { notFound } from 'next/navigation'
import { getFullMovieDetails } from '@/lib/movie-data'
import MovieDetailsClient from './MovieDetailsClient'

interface MoviePageProps {
  params: { id: string }
}

export default async function MovieDetailsPage({ params }: MoviePageProps) {
  const movie = await getFullMovieDetails(params.id)

  if (!movie) {
    notFound()
  }

  return <MovieDetailsClient movie={movie} />
}