import { Movie, Showtime } from "@/types/types";
import { screens } from "@/data/screens";
import React from "react";
import Link from "next/link";
interface Iprops {
  showTimes: Showtime[];
  movie: Movie;
}

const ShowtimeItem = ({ showTimes, movie }: Iprops) => {
  return (
    <div className="bg-white shadow-lg rounded-lg w-full mx-auto max-w-6xl flex flex-col items-start border border-gray-300 md:flex-row overflow-hidden">
      <img
        src={movie.image || ""}
        alt={`${movie.title} poster`}
        title={`${movie.title} poster`}
        className="md:w-1/4 w-full md:h-auto bg-gray-200 flex items-center justify-center"
      />

      <div className="md:w-3/4 w-full p-6 flex flex-col justify-center relative">
        <h2 className="text-2xl font-bold">{movie.title}</h2>
        <p className="text-gray-600 text-sm mt-1">
          {movie.genre} • 🕛 {movie.duration} m
        </p>
        <div className="mt-4">
          <span className="text-gray-700 font-semibold">
            Available Showtimes:
          </span>
          <div className="mt-2 flex gap-2 flex-wrap">
            {showTimes.map((show, index) => {
              const theater = screens.find(
                (screen) => screen.id === show.screenId
              );
              return (
                <Link
                  key={index}
                  href={{ pathname: "/booking", query: { showtime: show.id } }}
                  className="text-black bg-white border border-gray-300 cursor-pointer text-[14px] rounded-[7px] flex flex-col px-4 justify-center items-center hover:bg-[#f4f4f5] transition duration-300 ease-in-out"
                >
                  {show.time}
                  <span className="text-xs text-gray-500">{theater?.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-4 absolute top-4 right-4">
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full hover:opacity-75 transition duration-300 ease-in-out">
            {movie.rating}⭐
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShowtimeItem;
