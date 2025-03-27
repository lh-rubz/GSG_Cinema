"use client";
import { getAllMovies } from "@/lib/movie-data";
import { ALL_GENRES, Movie, MovieGenre } from "@/types/types";
import React, { useEffect, useState, useMemo } from "react";
import MoviesContainer from "@/components/moviesRouteContainer";
import { useRouter, useSearchParams } from "next/navigation";
import { MovieFilters } from "@/components/movies-filters";
import { NoMoviesFound } from "@/components/no-movies-found";

export enum ActiveTab {
  NOW = "now",
  SOON = "soon",
}

interface Filters {
  genre: MovieGenre | "";
  year: string;
  activeTab: ActiveTab;
  search: string;
}

const MoviePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get all non-hidden movies initially
  const allMovies = useMemo(() => getAllMovies().filter(movie => !movie.hidden), []);
  
  const [moviesList, setMoviesList] = useState<Movie[]>(allMovies);
  const [filters, setFilters] = useState<Filters>({
    genre: searchParams.get('genre') as MovieGenre || "",
    year: searchParams.get('year') || "",
    activeTab: (searchParams.get('tab') as ActiveTab) || ActiveTab.NOW,
    search: searchParams.get('search') || "",
  });

  // Get available genres from the visible movies
  const availableGenres = useMemo(() => {
    const genres = new Set<string>();
    allMovies.forEach(movie => {
      movie.genre.forEach(g => genres.add(g));
    });
    return Array.from(genres).sort();
  }, [allMovies]);

  // Get available years from the visible movies
  const availableYears = useMemo(() => {
    const years = new Set(allMovies.map(movie => movie.year));
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [allMovies]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.genre) params.set('genre', filters.genre);
    if (filters.year) params.set('year', filters.year);
    if (filters.activeTab !== ActiveTab.NOW) params.set('tab', filters.activeTab);
    if (filters.search) params.set('search', filters.search);
    
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  // Filter movies based on all criteria
  useEffect(() => {
    let filteredMovies = allMovies;

    // Filter by active tab
    filteredMovies = filteredMovies.filter(movie => 
      filters.activeTab === ActiveTab.NOW 
        ? movie.status === 'now_showing' 
        : movie.status === 'coming_soon'
    );

    // Apply genre filter if set
    if (filters.genre) {
      filteredMovies = filteredMovies.filter(
        movie => movie.genre.includes(filters.genre as MovieGenre)
      );
    }

    // Apply year filter if set
    if (filters.year) {
      filteredMovies = filteredMovies.filter(
        movie => movie.year === filters.year
      );
    }

    // Apply search filter if set
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredMovies = filteredMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm)
      );
    }

    setMoviesList(filteredMovies);
  }, [filters, allMovies]);

  const handleFilterChange = (name: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      genre: "",
      year: "",
      activeTab: ActiveTab.NOW,
      search: "",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 h-full">
      <h2 className="text-3xl font-bold mt-16 mb-8 text-gray-900 dark:text-white">
        {filters.activeTab === ActiveTab.NOW ? 'Now Showing' : 'Coming Soon'}
      </h2>
      
      <MovieFilters
        filters={filters}
        availableGenres={availableGenres}
        availableYears={availableYears}
        onFilterChange={handleFilterChange}
        onResetFilters={resetFilters}
      />

      {moviesList.length > 0 ? (
        <MoviesContainer movies={moviesList} />
      ) : (
        <NoMoviesFound filters={filters} onResetFilters={resetFilters} />
      )}
    </div>
  );
};

export default MoviePage;