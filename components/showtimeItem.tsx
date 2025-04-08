import { Movie, Showtime } from "@/types/types";
import { screens } from "@/data/screens";
import React, { useState } from "react";
import Link from "next/link";

interface Iprops {
  showTimes: Showtime[];
  movie: Movie;
}

const ShowtimeItem = ({ showTimes, movie }: Iprops) => {
  const [showHours, setShowHours] = useState(false);
  
  // Sort showtimes by time
  const sortedShowTimes = [...showTimes].sort((a, b) => {
    const getMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
    return getMinutes(a.time) - getMinutes(b.time);
  });

  // Convert minutes to hours and minutes format
  const formatDuration = (minutes: number) => {
    if (showHours) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 shadow-lg dark:shadow-zinc-800/50 rounded-lg w-full mx-auto max-w-6xl flex flex-col items-start border border-zinc-300 dark:border-zinc-700 md:flex-row overflow-hidden transition-colors duration-300">
      {/* Movie Poster */}
      <div className="md:w-1/4 w-full aspect-[2/3] relative">
        <img
          src={movie.image || ""}
          alt={`${movie.title} poster`}
          title={`${movie.title} poster`}
          className="w-full h-full object-cover bg-zinc-200 dark:bg-zinc-800"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-movie.png';
          }}
        />
      </div>

      {/* Movie Details */}
      <div className="md:w-3/4 w-full p-6 flex flex-col justify-center relative">
        {/* Title and Metadata */}
        <div className="pr-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{movie.title}</h2>
          <div className="flex items-center gap-3 mt-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">{movie.genre}</span>
            <span className="text-zinc-400 dark:text-zinc-500">•</span>
            <span 
              className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1 cursor-pointer hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              onClick={() => setShowHours(!showHours)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDuration(movie.duration ? parseInt(movie.duration, 10) : 0)}
            </span>
          </div>
        </div>

        {/* Showtimes */}
        <div className="mt-4">
          <h3 className="text-zinc-700 dark:text-zinc-300 font-semibold">
            Available Showtimes:
          </h3>
          <div className="mt-2 flex gap-3 flex-wrap">
            {sortedShowTimes.map((show, index) => {
              const theater = screens.find((screen) => screen.id === show.screenId);
              return (
                <Link
                  key={index}
                  href={{ pathname: "/booking", query: { showtime: show.id } }}
                  className="text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg flex flex-col px-4 py-2 justify-center items-center hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all duration-200 shadow-sm hover:shadow-md min-w-[80px] group"
                >
                  <span className="font-medium group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {show.time}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {theater?.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-rose-600 dark:bg-rose-700 text-white text-xs font-bold rounded-full hover:opacity-90 transition duration-200 flex items-center gap-1">
            {movie.rating}
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShowtimeItem;