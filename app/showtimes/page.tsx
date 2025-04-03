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
  const urlDate = searchParams.get('date');

  // Convert dd-mm-yyyy to Date object
  const parseDBDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Format Date object to dd-mm-yyyy
  const formatDBDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format date for display (Today, Tomorrow, or Jul 5)
  const formatDisplayDate = (date: Date): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get dates for today and next 4 days
  const getDisplayDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  // Get all available showtime dates from database
  const allShowtimeDates = [...new Set(showtimes.map(showtime => showtime.date))];
  
  // Get dates to display (only those with showtimes)
  const displayDates = getDisplayDates()
    .filter(date => {
      const dbDate = formatDBDate(date);
      return allShowtimeDates.includes(dbDate);
    })
    .map(date => ({
      dateObj: date,
      dbDate: formatDBDate(date),
      displayText: formatDisplayDate(date)
    }));

  // Set initial date from URL or first available date
  const initialDate = urlDate && allShowtimeDates.includes(urlDate) 
    ? urlDate 
    : displayDates.length > 0 ? displayDates[0].dbDate : null;

  const [currentDate, setCurrentDate] = useState<string | null>(initialDate);
  const [filteredShowTimes, setFilteredShowTimes] = useState<Showtime[]>([]);

  // Update URL when date changes
  useEffect(() => {
    if (currentDate) {
      router.push(`?date=${currentDate}`);
      const arr = showtimes.filter(showtime => showtime.date === currentDate);
      setFilteredShowTimes(arr);
    }
  }, [currentDate, router]);

  if (!currentDate || displayDates.length === 0) {
    return (
      <div className="px-[24px] pt-[130px]">
        <h2 className="font-bold text-4xl mb-8">Showtimes</h2>
        <div className="min-h-100 py-8 text-center text-gray-500">
          No upcoming showtimes available
        </div>
      </div>
    );
  }

  return (
    <div className="px-[24px] pt-[130px]">
      <h2 className="font-bold text-4xl mb-8">Showtimes</h2>
      <div className="flex flex-col gap-4 mb-8">
        <p className="font-bold">Select Date</p>
        <div className="flex gap-2">
          {displayDates.map(({ dbDate, displayText, dateObj }) => {
            const hasShowtimes = allShowtimeDates.includes(dbDate);
            return (
              <button
                key={dbDate}
                className={`hover:bg-[#f4f4f5] transition duration-300 ease-in-out outline-none py-[10px] px-[20px] cursor-pointer text-[14px] rounded-[7px] ${
                  currentDate === dbDate
                    ? "text-white bg-rose-600"
                    : "text-black bg-white border border-gray-300"
                } ${!hasShowtimes ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => hasShowtimes && setCurrentDate(dbDate)}
                disabled={!hasShowtimes}
              >
                {displayText}
              </button>
            );
          })}
        </div>
      </div>
      
      {filteredShowTimes.length > 0 ? (
        <ShowTimesContainer moviesShowTimes={filteredShowTimes} />
      ) : (
        <div className=" py-8 text-center text-gray-500">
          No showtimes available for {formatDisplayDate(parseDBDate(currentDate))}
        </div>
      )}
    </div>
  );
};

export default Page;