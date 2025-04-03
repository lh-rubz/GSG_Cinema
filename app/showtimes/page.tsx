"use client";
import React, { useEffect } from "react";
import { showtimes } from "@/data/showtimes";
import { useState } from "react";
import ShowTimesContainer from "@/components/showTimesContainer";
import { Showtime } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlDate = searchParams.get("date");

  // Helper to convert dd-mm-yyyy to Date object (handles no leading zero)
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Helper to format Date object to dd-mm-yyyy (with leading zeros)
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Get today's date and the next 4 days in dd-mm-yyyy format
  const getUpcomingDates = () => {
    const today = new Date();
    const upcomingDates: string[] = [];

    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      upcomingDates.push(formatDate(date));
    }

    return upcomingDates;
  };

  const dates = getUpcomingDates();

  // Set the initial date from URL or default to today
  const initialDate = urlDate && dates.includes(urlDate) ? urlDate : dates[0];
  const [currentDate, setCurrentDate] = useState<string>(initialDate);
  const [filteredShowTimes, setFilteredShowTimes] = useState<Showtime[]>([]);

  // Filter showtimes based on selected date
  useEffect(() => {
    const filtered = showtimes.filter((showtime) => showtime.date === currentDate);
    setFilteredShowTimes(filtered);
    router.push(`?date=${currentDate}`);
  }, [currentDate, router]);

  return (
    <div className="px-[24px] pt-[130px] bg-white dark:bg-black min-h-screen">
      <h2 className="font-bold text-4xl mb-8 text-gray-900 dark:text-white">Showtimes</h2>

      {/* Select Date */}
      <div className="flex flex-col gap-4 mb-8">
        <p className="font-bold text-gray-700 dark:text-gray-300">Select Date</p>
        <div className="flex gap-2 flex-wrap">
          {dates.map((date) => (
            <button
              key={date}
              className={`
                transition-all duration-200 ease-in-out 
                py-[10px] px-[20px] cursor-pointer text-sm rounded-lg
                font-medium
                ${
                  currentDate === date
                    ? "text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
                    : "text-gray-800 bg-white hover:bg-gray-50 border border-gray-200 dark:text-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800"
                }
                focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-black
                shadow-sm hover:shadow-md
              `}
              onClick={() => setCurrentDate(date)}
            >
              {parseDate(date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </button>
          ))}
        </div>
      </div>

      {/* Showtimes Display */}
      {filteredShowTimes.length > 0 ? (
        <ShowTimesContainer moviesShowTimes={filteredShowTimes} />
      ) : (
        <div className="py-8 px-4 text-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="mx-auto w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
            <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
            No showtimes available for{" "}
            <span className="text-rose-600 dark:text-rose-500">
              {parseDate(currentDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Please check back later or select another date
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;