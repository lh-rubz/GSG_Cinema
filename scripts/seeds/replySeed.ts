import { Movie, User } from '@prisma/client';
import { Reply } from '@/types/types';
import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

(async () => {
  try {
    const repliesData: Reply[] = [
        {
            id: "rep1",
            reviewId: "rev1",
            userId: "u1",
            comment: "I completely agree! The dream sequences were incredible.",
            date: "2023-05-16T18:10:00Z",
            reportedBy: []
        },
        {
            id: "rep2",
            reviewId: "rev2",
            userId: "u2",
            comment: "I was surprised by how much I enjoyed it too. The social commentary was spot on.",
            date: "2023-05-16T18:10:00Z",
            reportedBy: []
        },
        {
            id: "rep3",
            reviewId: "rev3",
            userId: "u5",
            comment: "The cinematography was breathtaking. Denis Villeneuve is a master.",
            date: "2023-05-16T18:10:00Z",
            reportedBy: []
        },
        
    ];
    for (const reply of repliesData) {
        try {
          const response = await api.post(
            `/reviews/${reply.reviewId}/reply`,
            {
              id: reply.id,
              userId: reply.userId,
              comment: reply.comment,
              date: reply.date
            }
          );
          console.log(`✅ Created reply ${reply.id} for review ${reply.reviewId}`);
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
