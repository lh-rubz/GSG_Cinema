import { Showtime } from "@/types/types";

  

  export const showtimes: Showtime[] = [
    // Inception showtimes
    {
      id: 'sh1',
      movieId: 'm1',
      screenId: 's1',
      date: '15-11-2023',
      time: '10:00',
      format: '2D',
      price: 12.99
    },
    {
      id: 'sh2',
      movieId: 'm1',
      screenId: 's1',
      date: '15-11-2023',
      time: '13:30',
      format: '2D',
      price: 12.99
    },
    {
      id: 'sh3',
      movieId: 'm1',
      screenId: 's2',
      date: '3-4-2025',
      time: '11:00',
      format: 'imax',
      price: 18.99
    },
    
    // The Dark Knight showtimes
    {
      id: 'sh4',
      movieId: 'm2',
      screenId: 's3',
      date: '15-11-2023',
      time: '14:00',
      format: '4dx',
      price: 22.99
    },
    {
      id: 'sh5',
      movieId: 'm2',
      screenId: 's1',
      date: '15-11-2023',
      time: '16:30',
      format: '3D',
      price: 15.99
    },
    {
      id: 'sh6',
      movieId: 'm1',
      screenId: 's3',
      date: '16-11-2023',
      time: '12:00',
      format: '3D',
      price: 16.99
    }
  ];