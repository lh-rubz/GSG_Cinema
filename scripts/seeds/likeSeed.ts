import { Movie, Reply, User } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

(async () => {
  try {
    const likeData: any[] = [
        {
           reviewId: "rev1",
           userId: "u1"
        },
        {
            reviewId: "rev1",
            userId: "u2"
         },
         {
            reviewId: "rev2",
            userId: "u3"
         },
        
    ];
    for (const like of likeData) {
        try {
          const response = await api.post(
            `/reviews/${like.reviewId}/like`,
            {
              id: like.reviewId,
              userId: like.userId
            }
          );
          console.log(`✅ Created reply ${like.reviewId} for review ${like.reviewId}`);
        } catch (error: unknown) {
            if (error instanceof Error) {
              console.error("❌ Error seeding replies:", error.message);
            } else {
              console.error("❌ Unknown error seeding replies:", error);
            }
          }
      }
  
      console.log("✅ Reply seeding completed");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("❌ Error seeding replies:", error.message);
      } else {
        console.error("❌ Unknown error seeding replies:", error);
      }
    }
  })();
