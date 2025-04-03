import React from "react";
import { promotions } from "@/data/promotions";
import PromotionsContainer from "@/components/promotionsContainer";
import { Promotion } from "@/types/types";
const Page = async () => {
  // عند عمل الايندبوينت للبروموشن رح اعدله يجيبهم منها 
  const promotionsList: Promotion[] = promotions;
  return (
    <div className="container mx-auto px-4 py-12 h-full">
      <h2 className="text-3xl font-bold mt-16 mb-8 text-gray-900 dark:text-white">
        Promotions & Offers
      </h2>
      <PromotionsContainer promotions={promotionsList} />
    </div>
  );
};

export default Page;
