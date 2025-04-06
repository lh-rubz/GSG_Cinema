import React from "react";
import { promotions } from "@/data/promotions";
import PromotionsContainer from "@/components/promotionsContainer";
import { Promotion } from "@/types/types";
import { parseDDMMYYYY } from "@/functions";

const Page = async () => {
  const currentDate = new Date();
  
  // Filter promotions with DD-MM-YYYY format
  const futurePromotions: Promotion[] = promotions.filter(promotion => {
    const expiryDate = parseDDMMYYYY(promotion.expiry_date);
    return expiryDate >= currentDate;
  });

  return (
    <div className="container mx-auto px-4 py-12 h-full">
      <h2 className="text-3xl font-bold mt-16 mb-8 text-gray-900 dark:text-white">
        Promotions & Offers
      </h2>
      
      {futurePromotions.length > 0 ? (
        <PromotionsContainer promotions={futurePromotions} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 min-h-[50vh] gap-4">
        <svg
          className="w-24 h-24 text-gray-300 dark:text-gray-600 animate-bounce"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
        <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          No Special Offers Available
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md text-center px-4">
          We're preparing some exciting promotions for you. Please check back later!
        </p>
      </div>
      )}
    </div>
  );
};

export default Page;