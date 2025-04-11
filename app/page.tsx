'use client'

import { FeaturesSection } from "@/components/features-section";
import { GenreSection } from "@/components/genre-section";
import { HeroSection } from "@/components/hero-section";
import { MovieSection } from "@/components/movie-section";
import { movies } from "@/data/movies";

import Link from "next/link";
import { User, LockKeyhole, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const featuredMovies = movies.slice(0, 4);
  const genreMovies = movies.slice(4, 8);

  return (
    <>
<HeroSection />


      <MovieSection 
        title="Now Showing" 
        subtitle="Catch the latest blockbusters on the big screen" 
        movies={featuredMovies} 
      />
      <GenreSection movies={genreMovies} />
      <FeaturesSection />
    </>
  );
}