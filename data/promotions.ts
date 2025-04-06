import { Promotion } from "@/types/types";

export const promotions: Promotion[] = [
  {
    id: "1",
    title: "Birthday Special",
    description: "Free ticket on your birthday with valid ID",
    expiry_date: "31-12-2025",  
    discount_code: "BIRTHDAY",
    discount_percentage: 100,
    image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202009/3021/SfK6snCLSX4qRfmIVQXrYXJK.png",
  },
  {
    id: "2",
    title: "Weekend Deal",
    description: "Buy one ticket, get one free every Saturday & Sunday",
    expiry_date: "15-10-2025", 
    discount_code: "WEEKEND50",
    discount_percentage: 50,
    image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202009/3021/SfK6snCLSX4qRfmIVQXrYXJK.png",
  },
  {
    id: "3",
    title: "Student Discount",
    description: "20% off for students with a valid student ID",
    expiry_date: "30-11-2025",  
    discount_code: "STUDENT20",
    discount_percentage: 20,
    image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202009/3021/SfK6snCLSX4qRfmIVQXrYXJK.png",
  },
];