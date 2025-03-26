"use client";
import { getAllMovies } from "@/lib/movie-data";
import { Movie } from "@/types/types";
import React, { useEffect, useState } from "react";
import MoviesContainer from "@/components/moviesRouteContainer";
enum activetab {
  now = "now",
  soon = "soon",
}
interface Ifilters {
  genre: string;
  year: string;
  activeTab: activetab;
}
const Page = () => {
  const allMovies = getAllMovies();
  const [MoviesList, setMoviesList] = useState<Movie[]>(allMovies);
  const [filters, setFilters] = useState<Ifilters>({
    genre: "",
    year: "",
    activeTab: activetab.now,
  });

  useEffect(() => {
    let filteredMovies = allMovies;

    if (filters.genre) {
      filteredMovies = filteredMovies.filter(
        (movie) => movie.genre === filters.genre
      );
    }
  
    if (filters.year) {
      filteredMovies = filteredMovies.filter(
        (movie) => movie.year === filters.year
      );
    }
  
    setMoviesList(filteredMovies);
  }, [filters, allMovies]);

  return (
    <div className="px-8 py-12">
      <h2
        style={{ fontWeight: "bold", fontSize: "2rem" }}
        className="mt-[60px] mb-[30px]"
      >
        Movies
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 p-[4px] border border-gray-300 bg-[#f4f4f5] rounded-md overflow-hidden">
          <button
            className={`cursor-pointer rounded-md text-center text-sm px-4 ${
              filters.activeTab === "now" ? "bg-white" : "bg-transparent"
            }`}
            onClick={() => setFilters({ ...filters, activeTab: activetab.now })}
          >
            Now Showing
          </button>
          <button
            className={`cursor-pointer rounded-md text-center text-sm px-4 ${
              filters.activeTab === "soon" ? "bg-white" : "bg-transparent"
            }`}
            onClick={() =>
              setFilters({ ...filters, activeTab: activetab.soon })
            }
          >
            Coming Soon
          </button>
        </div>

        <select
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
          title="genre"
          value={filters.genre}
          className="p-2 h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Genre</option>
          <option value="Adventure">Adventure</option>
          <option value="Thriller">Thriller</option>
          <option value="Romance">Romance</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Comedy/Drama">Comedy/Drama</option>
          <option value="Action">Action</option>
          <option value="Horror">Horror</option>
          <option value="Mystery">Mystery</option>
          <option value="Drama">Sci-Fi/Thriller</option>
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          title="year"
          value={filters.year}
          className="p-2 h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Year</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
          <option value="2017">2017</option>
          <option value="2016">2016</option>
          <option value="2015">2015</option>
          <option value="2014">2014</option>
          <option value="2013">2013</option>
          <option value="2012">2012</option>
          <option value="2011">2011</option>
          <option value="2010">2010</option>
          <option value="2009">2009</option>
          <option value="2008">2008</option>
          <option value="2007">2007</option>
          <option value="2006">2006</option>
          <option value="2005">2005</option>
          <option value="2004">2004</option>
          <option value="2003">2003</option>
          <option value="2002">2002</option>
          <option value="2001">2001</option>
          <option value="2000">2000</option>
        </select>
      </div>
      <MoviesContainer movies={MoviesList} />
    </div>
  );
};

export default Page;
