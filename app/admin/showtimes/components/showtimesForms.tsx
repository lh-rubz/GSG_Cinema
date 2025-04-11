// components/showtime-form.tsx
"use client"

import { FormField } from "@/components/form-field"
import { Search } from "lucide-react"
import { Movie, Screen, Showtime } from "@/types/types"
import { useState } from "react"

interface ShowtimeFormProps {
  formData: Partial<Showtime>
  formErrors: Record<string, string>
  movies: Movie[]
  screens: Screen[]
  onSubmit: () => void
  onCancel: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  mode: "add" | "edit"
}

export function ShowtimeForm({
  formData,
  formErrors,
  movies,
  screens,
  onSubmit,
  onCancel,
  onChange,
  mode
}: ShowtimeFormProps) {
  const [showMovieDropdown, setShowMovieDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const movieFormats = ["TwoD", "ThreeD", "imax", "fourDx"]
  
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return ""
    const [day, month, year] = dateStr.split("-")
    return `${year}-${month}-${day}` // Convert to yyyy-mm-dd for input[type="date"]
  }

  const filteredMovies = movies.filter(movie => 
    movie.status === "now_showing" && 
    !movie.hidden &&
    (movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Movie *
          </label>
          <button 
            type="button"
            onClick={() => setShowMovieDropdown(!showMovieDropdown)}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            {showMovieDropdown ? 'Hide movies' : 'Show movies'}
          </button>
        </div>
        
        {/* Important Note - Always Visible */}
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Note: Only movies currently showing are available. To add a showtime for a different movie, please update the movie status in the Movies section.
          </p>
        </div>  
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onFocus={() => setShowMovieDropdown(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          />
        </div>
        
        {/* Movie Dropdown */}
        {showMovieDropdown && (
          <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
            {filteredMovies.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMovies.map((movie) => (
                  <li key={movie.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange({
                          target: {
                            name: "movieId",
                            value: movie.id
                          }
                        } as React.ChangeEvent<HTMLInputElement>)
                        setShowMovieDropdown(false)
                      }}
                      className={`w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 ${
                        formData.movieId === movie.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                      }`}
                    >
                      {movie.image && (
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{movie.title} ({movie.year})</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{movie.genre}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-3 text-sm text-gray-500 dark:text-gray-400">No movies found matching your search</p>
            )}
          </div>
        )}
       
        {/* Selected Movie Preview */}
        {formData.movieId && (
          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {movies.find(m => m.id === formData.movieId)?.image && (
                <img
                  src={movies.find(m => m.id === formData.movieId)?.image}
                  alt={movies.find(m => m.id === formData.movieId)?.title}
                  className="w-12 h-16 object-cover rounded"
                />
              )}
              <div>
                <p className="font-medium">
                  {movies.find(m => m.id === formData.movieId)?.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Selected for showtime
                </p>
              </div>
            </div>
          </div>
        )}
        {formErrors.movieId && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">{formErrors.movieId}</p>
        )}
      </div>

      <FormField label="Screen" id="screenId" required>
        <select
          id="screenId"
          name="screenId"
          value={formData.screenId || ""}
          onChange={onChange}
          className={`w-full px-3 py-2 rounded-md border ${
            formErrors.screenId ? 'border-red-500 dark:border-red-400' : 'border-zinc-300 dark:border-zinc-700'
          } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent`}
          required
        >
          <option value="">Select a screen</option>
          {screens.map((screen) => (
            <option key={screen.id} value={screen.id}>
              {screen.name}
            </option>
          ))}
        </select>
        {formErrors.screenId && (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400">{formErrors.screenId}</p>
        )}
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Date" id="date" required>
          <input
            type="date"
            id="date"
            name="date"
            value={formatDateForInput(formData.date || "")}
            onChange={onChange}
            className={`w-full px-3 py-2 rounded-md border ${
              formErrors.date ? 'border-red-500 dark:border-red-400' : 'border-zinc-300 dark:border-zinc-700'
            } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent`}
            required
          />
          {formErrors.date ? (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{formErrors.date}</p>
          ) : (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Select a date for the showtime</p>
          )}
        </FormField>

        <FormField label="Time (24-hour format)" id="time" required>
          <input
            type="text"
            id="time"
            name="time"
            value={formData.time || ""}
            onChange={onChange}
            placeholder="HH:MM (e.g., 14:30)"
            className={`w-full px-3 py-2 rounded-md border ${
              formErrors.time ? 'border-red-500 dark:border-red-400' : 'border-zinc-300 dark:border-zinc-700'
            } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent`}
            required
            pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
          />
          {formErrors.time ? (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{formErrors.time}</p>
          ) : (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Enter time in 24-hour format (e.g., 14:30 for 2:30 PM)</p>
          )}
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Format" id="format" required>
          <select
            id="format"
            name="format"
            value={formData.format || "TwoD"}
            onChange={onChange}
            className={`w-full px-3 py-2 rounded-md border ${
              formErrors.format ? 'border-red-500 dark:border-red-400' : 'border-zinc-300 dark:border-zinc-700'
            } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent`}
            required
          >
            {movieFormats.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
          {formErrors.format && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{formErrors.format}</p>
          )}
        </FormField>

        <FormField label="Price" id="price" required>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price || ""}
            onChange={onChange}
            min="0"
            step="0.01"
            className={`w-full px-3 py-2 rounded-md border ${
              formErrors.price ? 'border-red-500 dark:border-red-400' : 'border-zinc-300 dark:border-zinc-700'
            } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent`}
            required
          />
          {formErrors.price && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{formErrors.price}</p>
          )}
        </FormField>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          {mode === "add" ? "Add Showtime" : "Update Showtime"}
        </button>
      </div>
    </div>
  )
}