import { Review } from "@/types/types";

export const reviews:Review[]=[
    {
        id: "rev1",
        movieId: "m1",
        userId: "u1",
        rating: 4.5,
        comment: "Absolutely breathtaking cinematography and storytelling. A masterpiece!",
        date: "10-05-2024",
        likedBy: ["u1","u2"],
        replies: ["rep1","rep2","rep3"],
        reportedBy:[]
      },
    ]