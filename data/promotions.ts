import { Promotion } from "@/types/types";

export const promotions: Promotion[] = [
  {
    id: "1",
    code: "BIRTHDAY",
    description: "Free ticket on your birthday with valid ID",
    type: "PERCENTAGE",
    value: 100,
    startDate: "2024-01-01",
    expiryDate: "2025-12-31",
    isActive: true,
    image: "https://image.api.playstation.com/vulcan/ap/rnd/202009/3021/SfK6snCLSX4qRfmIVQXrYXJK.png",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "2",
    code: "WEEKEND50",
    description: "Buy one ticket, get one free every Saturday & Sunday",
    type: "BUY_ONE_GET_ONE",
    value: 1,
    startDate: "2024-01-01",
    expiryDate: "2025-10-15",
    isActive: true,
    image: "https://image.api.playstation.com/vulcan/ap/rnd/202009/3021/SfK6snCLSX4qRfmIVQXrYXJK.png",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "3",
    code: "STUDENT20",
    description: "20% off for students with a valid student ID",
    type: "PERCENTAGE",
    value: 20,
    startDate: "2024-01-01",
    expiryDate: "2025-11-30",
    isActive: true,
    image: "https://image.api.playstation.com/vulcan/ap/rnd/202009/3021/SfK6snCLSX4qRfmIVQXrYXJK.png",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
];