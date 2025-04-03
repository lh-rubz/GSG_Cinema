import { User } from "@/types/types";

export const users: User[] = [
    {
      id: "u1",
      username: "john_doe",
      displayName: "John Doe",
      bio: "Movie enthusiast and tech lover.",
      email: "john.doe@example.com",
      password: "password123",
      gender: "M",
      movieIdsPurchased: ["movie1", "movie3", "movie5"],
      profileImage: "https://pm1.aminoapps.com/7464/cdd2988d62cb97ca09dcf65f1d1e65bd32db05e1r1-250-249v2_hq.jpg",
      role: "customer"
    },
    {
      id: "u2",
      username: "jane_smith",
      displayName: "Jane Smith",
      bio: "Love to watch drama movies and explore new genres.",
      email: "jane.smith@example.com",
      password: "password456",
      gender: "F",
      movieIdsPurchased: ["movie2", "movie4"],
      profileImage: "https://pm1.aminoapps.com/7464/c18b6bd02be060d45be655ba5707a558ba17905cr1-250-249v2_uhq.jpg",
      role: "customer"
    },
    {
      id: "u3",
      username: "admin_user",
      displayName: "Admin User",
      bio: "Administrator of the movie platform.",
      email: "admin@example.com",
      password: "adminpass",
      gender: "M",
      movieIdsPurchased: ["movie1", "movie2", "movie3", "movie4", "movie5"],
      profileImage: "https://static.wikia.nocookie.net/29397ee9-9811-487c-9cca-cee576bab17a/scale-to-width/370",
      role: "admin"
    },
    {
      id: "u4",
      username: "michael_staff",
      displayName: "Michael Staff",
      bio: "Staff member managing customer support.",
      email: "michael.staff@example.com",
      password: "staffpass789",
      gender: "M",
      movieIdsPurchased: ["movie1", "movie3", "movie5"],
      profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBn5ehGPihohiyKjNCHcu6v-1Tal--Zw3IadKrXybHYobVmj60hW2NZ4RUzdJuLYgTzcQ&usqp=CAU",
      role: "staff"
    },
    {
      id: "u5",
      username: "emily_customer",
      displayName: "Emily Customer",
      bio: "Avid fan of action and thriller movies.",
      email: "emily.customer@example.com",
      password: "customerpass123",
      gender: "F",
      movieIdsPurchased: ["movie2", "movie4"],
      profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRJr80-rjIaA_qsFPZX_zCO5lBaWWk3i-A0Q&s",
      role: "customer"
    }
  ];
  