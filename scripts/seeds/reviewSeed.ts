import { Movie, User } from '@prisma/client';
import { Review } from '@/types/types';
import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

(async () => {
  try {
    const reviewData: Review[] = [
       {
        id: "rev1",
        userId: "u1",
        movieId: "m1",
        rating: 5,
        comment: "One of the best movies I've ever seen. The concept is mind-blowing and the execution is flawless.",
        date: "2023-05-16T14:30:00Z",
        likedBy: [],
        replies: [],
        reportedBy: []
       },
       {
        id: "rev2",
        userId: "u2",
        movieId: "m2",
        rating: 4,
        comment: "A surprisingly deep and entertaining movie. Great performances by Margot Robbie and Ryan Gosling.",
        date: "2023-05-16T15:45:00Z",
        likedBy: [],
        replies: [],
        reportedBy: []
      },
      {
        id: "rev3",
        userId: "u3",
        movieId: "m3",
        rating: 5,
        comment: "Visually stunning and faithful to the book. Can't wait for part two!",
        date: "2023-05-16T16:20:00Z",
        likedBy: [],
        replies: [],
        reportedBy: []
      }
    ];

    const reviewResponses: AxiosResponse[] = await Promise.all(reviewData.map(m => api.post('/reviews', m)));
    console.log("✅ users seeded successfully.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error seeding users:", error.message);
    } else {
      console.error("❌ Unknown error seeding users:", error);
    }
  }
})();
