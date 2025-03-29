"use client";
import React, { useEffect } from "react";
import { showtimes } from "@/data/showtimes";
import { useState } from "react";
import ShowTimesContainer from "@/components/showTimesContainer";
import { Showtime } from "@/types/types";
const Page = () => {
  console.log("------------------------------------------------");
  const dates: string[] = [
    ...new Set(showtimes.map((showtime) => showtime.date)),
  ];
  const [currentDate, setCurrentDate] = useState<string>(dates[0]);
  const [filterdShowTimes, setFilteredShowTimes] = useState<Showtime[]>([]);
  console.log("Current Date: ", currentDate);
  useEffect(() => {
    const arr = showtimes.filter((showtime) => showtime.date === currentDate);
    setFilteredShowTimes(() => arr);
    console.log("Filtered Showtimes: ", arr);
  }, [currentDate]);
  console.log("------------------------------------------------");
  return (
    <div className="px-[24px] pt-[130px]">
      <h2 className="font-bold text-4xl mb-8">Showtimes</h2>
      <div className="flex flex-col gap-4 mb-8">
        <p className="font-bold">Select Date</p>
        <div className="flex gap-2">
          {dates.map((date, index) => (
            <button
              key={index + date}
              className={`hover:bg-[#f4f4f5] transition duration-300 ease-in-out outline-none py-[10px] px-[20px] cursor-pointer text-[14px] rounded-[7px] ${
                currentDate == date
                  ? "text-white bg-rose-600"
                  : "text-black bg-white border border-gray-300"
              }`}
              onClick={() => setCurrentDate(date)}
            >
              {date}
            </button>
          ))}
        </div>
      </div>
      <ShowTimesContainer moviesShowTimes={filterdShowTimes} />
    </div>
  );
};

export default Page;
