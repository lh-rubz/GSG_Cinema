
import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

(async () => {
  try {
    const receiptsData = [
        {
            "id": "rcp1",
            "userId": "u1", 
            "movieId": "m1", 
            "ticketIds": ["tck1"], 
            "totalPrice": 12.99,
            "paymentMethod": "credit_card",
            "receiptDate": "2023-05-14T10:35:00Z"
        },
        {
            "id": "rcp2",
            "userId": "u5", 
            "movieId": "m5", 
            "ticketIds": ["tck2"], 
            "totalPrice": 14.99,
            "paymentMethod": "paypal",
            "receiptDate": "2023-05-14T11:50:00Z"
        }
    ]
    

    const receiptsResponses: AxiosResponse[] = await Promise.all(receiptsData.map(d => api.post('/receipts', d)));
    const receiptsIds = receiptsResponses.map(res => res.data.id); 
    
    console.log("✅ receipts seeded successfully.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error seeding receipts:", error.message);
    } else {
      console.error("❌ Unknown error seeding receipts:", error);
    }
  }
})();
