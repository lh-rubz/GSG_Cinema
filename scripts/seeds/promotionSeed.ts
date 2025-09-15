import { Promotion as PrismaPromotion } from '@prisma/client';
import { Promotion } from '@/types/types';
import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

type PromotionInput = Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>;

(async () => {
  try {
    const promotionData: PromotionInput[] = [
      {
        code: "WELCOME20",
        type: "PERCENTAGE",
        value: 20.0,
        description: "Welcome offer - 20% off on your first booking",
        startDate: "2024-01-01T00:00:00.000Z",
        expiryDate: "2024-12-31T23:59:59.999Z",
        isActive: true,
        image: "https://image.api.playstation.com/vulcan/ap/rnd/202009/3021/SfK6snCLSX4qRfmIVQXrYXJK.png"
      },
      {
        code: "MOVIENIGHT",
        type: "FIXED_AMOUNT",
        value: 5.0,
        description: "Movie night special - $5 off on any booking",
        startDate: "2024-01-01T00:00:00.000Z",
        expiryDate: "2024-12-31T23:59:59.999Z",
        isActive: true
      },
      {
        code: "BOGO",
        type: "BUY_ONE_GET_ONE",
        value: 1.0,
        description: "Buy one ticket, get one free",
        startDate: "2024-01-01T00:00:00.000Z",
        expiryDate: "2024-12-31T23:59:59.999Z",
        isActive: true
      },
    
    ];

    console.log("Sending promotion data:", JSON.stringify(promotionData, null, 2));

    for (const promotion of promotionData) {
      try {
        const response = await api.post('/promotions', promotion);
        console.log(`Successfully created promotion ${promotion.code}:`, response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(`Error creating promotion ${promotion.code}:`, {
            status: error.response?.status,
            data: error.response?.data,
            request: error.config?.data
          });
        } else {
          console.error(`Error creating promotion ${promotion.code}:`, error);
        }
      }
    }
    
    console.log("✅ Promotions seeding completed.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error seeding promotions:", error.message);
    } else {
      console.error("❌ Unknown error seeding promotions:", error);
    }
  }
})(); 