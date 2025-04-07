import { CastMember } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Replace with your actual API base URL
});


(async () => {
  try {
    // Cast members
    const castData: CastMember[] = [
      {id: "c1", name: "Leonardo DiCaprio", image: "https://example.com/images/leonardo-dicaprio.jpg", character: "Dom Cobb" },
      {id: "c2", name: "Margot Robbie", image: "https://example.com/images/margot-robbie.jpg", character: "Barbie" },
      {id: "c3",name: "Ryan Gosling", image: "https://example.com/images/ryan-gosling.jpg", character: "Ken" },
      {id: "c4", name: "Timothée Chalamet", image: "https://example.com/images/timothee-chalamet.jpg", character: "Paul Atreides" },
      {id: "c5", name: "Zendaya", image: "https://example.com/images/zendaya.jpg", character: "Chani" }
    ];

    const castResponses: AxiosResponse[] = await Promise.all(castData.map(c => api.post('/cast-members', c)));
    const castIds = castResponses.map(res => res.data.id); // Assuming response has `id`

    console.log("✅ Data seeded successfully.");
  } catch (error: unknown) {
  if (error instanceof Error) {
    console.error("❌ Error seeding data:", error.message);
  } else {
    console.error("❌ Unknown error:", error);
  }
}
})();
