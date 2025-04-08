"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MovieFilters } from "@/components/movies-filters";
import { NoMoviesFound } from "@/components/no-movies-found";
import { Movie, MovieGenre } from "@/types/types";
import { ALL_GENRES } from "@/types/types";
import MoviesContainer from "@/components/moviesRouteContainer";
import { moviesApi } from "@/lib";

import { useTheme } from "next-themes";
import { Loading } from "@/components/loading-inline";

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

interface LoadingProps {
  text?: string;
  color?: string;
}



const MovieListContent = ({ movies, filters }: { movies: Movie[]; filters: Filters }) => {
  return movies.length > 0 ? (
    <MoviesContainer movies={movies} />
  ) : (
    <NoMoviesFound filters={filters} onResetFilters={() => {}} />
  );
};

const MoviePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  const [moviesList, setMoviesList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    genre: searchParams.get('genre') as MovieGenre || "",
    year: searchParams.get('year') || "",
    activeTab: (searchParams.get('tab') as ActiveTab) || ActiveTab.NOW,
    search: searchParams.get('search') || "",
  });

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {

        const response = await moviesApi.getMovies({
          status: filters.activeTab === ActiveTab.NOW ? 'now_showing' : 'coming_soon',
          hidden: false
        });
        setMoviesList(response.data || []);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        setMoviesList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [filters.activeTab]);

  // Get available genres from the fetched movies
  const availableGenres = useMemo(() => {
    const genres = new Set<string>();
    moviesList.forEach(movie => {
      movie.genre.forEach(g => genres.add(g));
    });
    return Array.from(genres).sort();
  }, [moviesList]);

  // Get available years from the fetched movies
  const availableYears = useMemo(() => {
    const years = new Set(moviesList.map(movie => movie.year));
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [moviesList]);

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
  const filteredMovies = useMemo(() => {
    let filtered = moviesList;

    if (filters.genre) {
      filtered = filtered.filter(
        movie => movie.genre.includes(filters.genre as MovieGenre)
      );
    }

    if (filters.year) {
      filtered = filtered.filter(
        movie => movie.year === filters.year
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }, [moviesList, filters]);

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

      {isLoading ? (
        <Loading text={`Loading ${filters.activeTab === ActiveTab.NOW ? 'Now Showing' : 'Coming Soon'} movies...`} />
      ) : (
        <MovieListContent movies={filteredMovies} filters={filters} />
      )}
    </div>
  );
};

export default MoviePage;