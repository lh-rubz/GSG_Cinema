import { Promotion } from "@/types/types";
import React from "react";
import PromotionCard from "./promotionCard";
interface Iprops {
  promotions: Promotion[];
}
const PromotionsContainer = ({ promotions }: Iprops) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {promotions.map((prom) => (
        <PromotionCard key={prom.discount_code} promotion={prom} />
      ))}
    </div>
  );
};

export default PromotionsContainer;
