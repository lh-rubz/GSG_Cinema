"use client";
import { Showtime } from "@/types/types";
// import { getMovieById } from "@/lib/movie-data";
import React from "react";
// import { useState, useEffect } from "react";
import ShowtimeItem from "./showtimeItem";
import {movies} from "@/data/movies";
interface Iprops {
  moviesShowTimes: Showtime[];
}

const ShowTimesContainer = ({ moviesShowTimes }: Iprops) => {
  // const [showsList, setShowsList] = useState([]);
  // useEffect(() => {
   
  // }, [moviesShowTimes]);
  return <div className="flex flex-col gap-8 mb-8">{
    movies.map((m)=>{
      const MovieshowTimes= moviesShowTimes.filter((showtime) => showtime.movieId === m.id);
      if(MovieshowTimes.length === 0) return null;
      return <ShowtimeItem key={m.id} movie={m} showTimes={MovieshowTimes}/>
    })
  }</div>;
};

export default ShowTimesContainer;
