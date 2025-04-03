"use client";

import type { Promotion } from "@/types/types";
import Image from "next/image";
import { CalendarIcon, Copy } from "lucide-react";

interface Iprops {
  promotion: Promotion;
}

const PromotionCard = ({ promotion }: Iprops) => {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(promotion.discount_code);
  };

  return (
    <div className="border border-gray-200 rounded-lg flex flex-col justify-between gap-4  overflow-hidden">
      <div className="w-full aspect-video relative bg-gray-100">
        <Image
          src={promotion.image_url}
          alt={promotion.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-6 flex flex-col gap-3">
        <h2 className="text-2xl font-bold text-gray-900">{promotion.title}</h2>

        <p className="text-gray-600">{promotion.description}</p>

        <div className="flex items-center text-gray-500 mt-1">
          <CalendarIcon className="w-5 h-5 mr-2" />
          <span>
            Valid until{" "}
            {new Date(promotion.expiry_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2 gap-4">
          <div className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-md grow">
            <span className="font-mono font-bold mr-3">
              {promotion.discount_code}
            </span>
            <button
              onClick={handleCopyCode}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Copy discount code"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-white border-2 border-gray-900 rounded-full px-3 py-1">
            <span className="font-bold">
              {promotion.discount_percentage} OFF
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PromotionCard;
