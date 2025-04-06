
import { Screen, ScreenType, Showtime } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

(async () => {
  try {
    const showTimesData : Showtime[] = [
        {
            "id": "sh1",
            "movieId": "m1", 
            "screenId": "s1", 
            "date": "2023-05-15",
            "time": "18:30",
            "format": "TwoD",
            "price": 12.99
        },
        {
            "id": "sh2",
            "movieId": "m5", 
            "screenId": "s1", 
            "date": "2023-05-15",
            "time": "20:00",
            "format": "ThreeD",
            "price": 14.99
          }
    ]
    

    const showtimeResponses: AxiosResponse[] = await Promise.all(showTimesData.map(d => api.post('/showtimes', d)));
    const showtimeIds = showtimeResponses.map(res => res.data.id); 
    
    console.log("✅ showtimes seeded successfully.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error seeding showtimes:", error.message);
    } else {
      console.error("❌ Unknown error seeding showtimes:", error);
    }
  }
})();
