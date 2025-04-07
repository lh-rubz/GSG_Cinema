
import { Screen, ScreenType, Showtime, Ticket } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

(async () => {
  try {
    const ticketData = [
        {
            "id": "tck1",
            "userId": "u1", 
            "showtimeId": "sh1",
            "seatId": "s1_J1", 
            "price": 12.99,
            "purchaseDate": "2023-05-14T10:30:00Z",
            "status": "reserved"
        },
        {
            "id": "tck2",
            "userId": "u5", 
            "showtimeId": "sh2",
            "seatId": "s1_J4", 
            "price": 14.99,
            "purchaseDate": "2023-05-14T11:45:00Z",
            "status": "reserved"
        }
    ]
    

    const ticketResponses: AxiosResponse[] = await Promise.all(ticketData.map(d => api.post('/tickets', d)));
    const ticketIds = ticketResponses.map(res => res.data.id); 
    
    console.log("✅ tickets seeded successfully.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error seeding tickets:", error.message);
    } else {
      console.error("❌ Unknown error seeding tickets:", error);
    }
  }
})();
