"use client";
import { useTheme } from "next-themes";
import { PuffLoader } from "react-spinners";

interface LoadingProps {
    text?: string;
    color?: string;
  }
  
export const Loading = ({ text = "Loading...", color }: LoadingProps) => {
    const { theme } = useTheme();
    const loaderColor = color || (theme === "dark" ? "#ffffff" : "#dc2626");
  
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <PuffLoader 
          color={loaderColor} 
          size={50}
          speedMultiplier={1.2}
        />
        <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200 animate-pulse">
          {text}
        </p>
      </div>
    );
  };