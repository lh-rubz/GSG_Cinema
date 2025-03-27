"use client";

import { ActiveTab } from "@/app/movies/page";

interface NoMoviesFoundProps {
  filters: {
    genre: string;
    year: string;
    search: string;
    activeTab: ActiveTab;
  };
  onResetFilters: () => void;
}

export const NoMoviesFound = ({ filters, onResetFilters }: NoMoviesFoundProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-gray-400 dark:text-gray-500 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
      No movies found
    </h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-md">
      {filters.genre || filters.year || filters.search
        ? "Try adjusting your filters to see more results."
        : `There are currently no ${filters.activeTab === ActiveTab.NOW ? 'now showing' : 'coming soon'} movies.`}
    </p>
    {(filters.genre || filters.year || filters.search) && (
      <button
        onClick={onResetFilters}
        className="mt-4 px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
      >
        Reset All Filters
      </button>
    )}
  </div>
);