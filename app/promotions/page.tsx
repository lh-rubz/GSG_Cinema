"use client";

import React, { useState, useEffect } from "react";
import PromotionsContainer from "@/components/promotionsContainer";
import { Promotion } from "@/types/types";
import Image from "next/image";
import { promotionsApi } from "@/lib/endpoints/promotions";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await promotionsApi.getPromotions({ isActive: true });
        if (response.data) {
          setPromotions(response.data);
        } else {
          setPromotions([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const filterActivePromotions = (promotions: Promotion[]) => {
    const currentDate = new Date();
    return promotions.filter((promotion) => {
      // Parse the database date string (2025-04-30T03:44)
      const expiryDate = new Date(promotion.expiryDate);
      return expiryDate >= currentDate;
    });
  };

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 h-full">
        <h2 className="text-3xl font-bold mt-16 mb-8 text-gray-900 dark:text-white">
          Promotions & Offers
        </h2>
        <div className="flex flex-col items-center justify-center py-12 min-h-[50vh] gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading promotions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 h-full">
        <h2 className="text-3xl font-bold mt-16 mb-8 text-gray-900 dark:text-white">
          Promotions & Offers
        </h2>
        <div className="flex flex-col items-center justify-center py-12 min-h-[50vh] gap-4">
          <svg
            className="w-24 h-24 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Error Loading Promotions
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md text-center px-4">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const validPromotions = filterActivePromotions(promotions);

  return (
    <div className="container mx-auto px-4 py-12 h-full">
      <h2 className="text-3xl font-bold mt-16 mb-8 text-gray-900 dark:text-white">
        Promotions & Offers
      </h2>
      
      {validPromotions.length > 0 ? (
        <PromotionsContainer 
          promotions={validPromotions} 
        />
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
}