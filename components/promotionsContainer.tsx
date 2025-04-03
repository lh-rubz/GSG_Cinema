import { Promotion } from "@/types/types";
import React from "react";
import PromotionCard from "./promotionCard";
interface Iprops {
  promotions: Promotion[];
}
const PromotionsContainer = ({ promotions }: Iprops) => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">  {promotions.map((prom) => (
        <PromotionCard key={prom.id} promotion={prom} />
      ))}
    </div>
  );
};

export default PromotionsContainer;
