import { Director } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

(async () => {
  try {
    const directorData: Director[] = [
      {id: "d1", name: "Christopher Nolan", bio: "Christopher Edward Nolan is a British-American filmmaker...", image: "https://example.com/images/nolan.jpg" },
      {id: "d2", name: "Denis Villeneuve", bio: "Denis Villeneuve is a Canadian filmmaker...", image: "https://example.com/images/villeneuve.jpg" },
      {id: "d3", name: "Greta Gerwig", bio: "Greta Celeste Gerwig is an American actress and filmmaker. She has received nominations for the Academy Award for Best Director, Best Original Screenplay, and Best Adapted Screenplay.", image: "https://example.com/images/greta-gerwig.jpg" }
    ];

    const directorResponses: AxiosResponse[] = await Promise.all(directorData.map(d => api.post('/directors', d)));
    const directorIds = directorResponses.map(res => res.data.id); 
    
    console.log("✅ Directors seeded successfully.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error seeding directors:", error.message);
    } else {
      console.error("❌ Unknown error seeding directors:", error);
    }
  }
})();
