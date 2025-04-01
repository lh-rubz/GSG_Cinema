"use client";
import { ActiveTab } from "@/app/movies/page";
import { ALL_GENRES, MovieGenre } from "@/types/types";

import { useRouter, useSearchParams } from "next/navigation";

interface Filters {
  genre: MovieGenre | "";
  year: string;
  activeTab: ActiveTab;
  search: string;
}

interface MovieFiltersProps {
  filters: Filters;
  availableGenres: string[];
  availableYears: string[];
  onFilterChange: (name: keyof Filters, value: string) => void;
  onResetFilters: () => void;
}

export const MovieFilters = ({
  filters,
  availableGenres,
  availableYears,
  onFilterChange,
  onResetFilters,
}: MovieFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      <TabSwitcher 
        activeTab={filters.activeTab} 
        onChange={(tab) => onFilterChange('activeTab', tab)}
      />
      
      <SearchInput 
        value={filters.search}
        onChange={(value) => onFilterChange('search', value)}
      />

      <GenreFilter 
        value={filters.genre}
        options={availableGenres}
        onChange={(value) => onFilterChange('genre', value)}
      />

      <YearFilter 
        value={filters.year}
        options={availableYears}
        onChange={(value) => onFilterChange('year', value)}
      />

      {(filters.genre || filters.year || filters.search) && (
        <ResetButton onClick={onResetFilters} />
      )}
    </div>
  );
};

const TabSwitcher = ({ activeTab, onChange }: { 
  activeTab: ActiveTab; 
  onChange: (tab: ActiveTab) => void 
}) => (
  <div className="flex h-10 p-1 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
    {Object.values(ActiveTab).map(tab => (
      <button
        key={tab}
        className={`flex-1 cursor-pointer rounded-md text-center px-4 py-2 transition-all duration-200 text-sm whitespace-nowrap ${
          activeTab === tab 
            ? "bg-white dark:bg-gray-700 shadow-sm font-medium text-blue-600 dark:text-blue-400" 
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
        }`}
        onClick={() => onChange(tab)}
      >
        {tab === ActiveTab.NOW ? 'Now Showing' : 'Coming Soon'}
      </button>
    ))}
  </div>
);

const SearchInput = ({ value, onChange }: { 
  value: string; 
  onChange: (value: string) => void 
}) => (
  <div className="relative flex-1 min-w-[200px]">
    <input
      type="text"
      placeholder="Search movies..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 h-10 pl-10 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
    />
    <svg
      className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
);

const GenreFilter = ({ value, options, onChange }: { 
  value: string; 
  options: string[]; 
  onChange: (value: string) => void 
}) => (
  <select
    onChange={(e) => onChange(e.target.value)}
    value={value}
    className="p-2 h-10 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 min-w-[150px] shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
  >
    <option value="">All Genres</option>
    {options.map(genre => (
      <option key={genre} value={genre}>
        {genre}
      </option>
    ))}
  </select>
);

const YearFilter = ({ value, options, onChange }: { 
  value: string; 
  options: string[]; 
  onChange: (value: string) => void 
}) => (
  <select
    onChange={(e) => onChange(e.target.value)}
    value={value}
    className="p-2 h-10 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 min-w-[120px] shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
  >
    <option value="">All Years</option>
    {options.map(year => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>
);

const ResetButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="ml-2 px-4 h-10 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg"
  >
    Reset Filters
  </button>
);