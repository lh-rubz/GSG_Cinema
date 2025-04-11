"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { Modal } from "@/components/modal"
import { FormField } from "@/components/form-field"
import { ConfirmDialog } from "@/components/confirm-dialog"
import type { Showtime, Movie, Screen } from "@/types/types"
import { showtimesApi } from "@/lib/endpoints/showtimes"
import { moviesApi } from "@/lib/endpoints/movies"
import { screensApi } from "@/lib/endpoints/screens"
import type { ApiResponse } from "@/lib/client"

export default function ShowtimesPage() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [screens, setScreens] = useState<Screen[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentShowtime, setCurrentShowtime] = useState<Showtime | null>(null)
  const [timeFormat, setTimeFormat] = useState<'12' | '24'>('24')
  const [formData, setFormData] = useState<Partial<Showtime>>({
    movieId: "",
    screenId: "",
    date: "",
    time: "",
    format: "TwoD",
    price: 0,
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const movieFormats = ["TwoD", "ThreeD", "imax", "fourDx"]

  useEffect(() => {
    fetchShowtimes()
    fetchMovies()
    fetchScreens()
  }, [])

  const fetchShowtimes = async () => {
    try {
      setIsLoading(true)
      const response = await showtimesApi.getShowtimes()
      if (response.data) {
        setShowtimes(response.data)
      }
    } catch (error) {
      console.error("Error fetching showtimes:", error)
      setErrorMessage("Failed to load showtimes. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMovies = async () => {
    try {
      const response = await moviesApi.getMovies()
      if (response.data) {
        setMovies(response.data)
      }
    } catch (error) {
      console.error("Error fetching movies:", error)
      setErrorMessage("Failed to load movies. Please try again later.")
    }
  }

  const fetchScreens = async () => {
    try {
      const response = await screensApi.getScreens()
      if (response.data) {
        setScreens(response.data)
      }
    } catch (error) {
      console.error("Error fetching screens:", error)
      setErrorMessage("Failed to load screens. Please try again later.")
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.movieId) {
      errors.movieId = "Movie is required"
    }
    
    if (!formData.screenId) {
      errors.screenId = "Screen is required"
    }
    
    if (!formData.date) {
      errors.date = "Date is required"
    }
    
    if (!formData.time) {
      errors.time = "Time is required"
    }
    
    if (!formData.format) {
      errors.format = "Format is required"
    }
    
    if (formData.price === undefined || formData.price === null || formData.price <= 0) {
      errors.price = "Price must be greater than 0"
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddShowtime = () => {
    setFormData({
      movieId: "",
      screenId: "",
      date: "",
      time: "",
      format: "TwoD",
      price: 0,
    })
    setFormErrors({})
    setErrorMessage(null)
    setIsAddModalOpen(true)
  }

  const handleEditShowtime = (showtime: Showtime) => {
    setCurrentShowtime(showtime)
    setFormData({ ...showtime })
    setFormErrors({})
    setErrorMessage(null)
    setIsEditModalOpen(true)
  }

  const handleDeleteShowtime = (showtime: Showtime) => {
    setCurrentShowtime(showtime)
    setErrorMessage(null)
    setIsDeleteModalOpen(true)
  }

  const handleSaveShowtime = async () => {
    try {
      setErrorMessage(null)
      setFormErrors({})
      
      // Validate form before submitting
      if (!validateForm()) {
        return
      }

      // Format the time to ensure it's in 24-hour format
      const time = formData.time || ""
      const [hours, minutes] = time.split(':')
      const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`

      // Format the date from yyyy-mm-dd to dd-mm-yyyy
      const date = new Date(formData.date || "")
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      const formattedDate = `${day}-${month}-${year}`

      // Additional client-side validations
      const selectedDate = new Date(formData.date || "")
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        setFormErrors({ ...formErrors, date: "Cannot create showtimes for past dates" })
        setErrorMessage("Please select a future date for the showtime.")
        return
      }

      // Check if selected movie is available
      const selectedMovie = movies.find(m => m.id === formData.movieId)
      if (selectedMovie?.hidden) {
        setFormErrors({ ...formErrors, movieId: "Selected movie is currently hidden" })
        setErrorMessage("Cannot create showtime for a hidden movie. Please select an active movie.")
        return
      }

      if (selectedMovie?.status !== "now_showing") {
        setFormErrors({ ...formErrors, movieId: "Movie is not currently showing" })
        setErrorMessage("Can only create showtimes for movies that are currently showing.")
        return
      }
      
      if (isAddModalOpen) {
        const showtimeId = `sh${Date.now()}`
         console.log({ id: showtimeId,
          movieId: formData.movieId!,
          screenId: formData.screenId!,
          date: formattedDate,
          time: formattedTime,
          format: formData.format!,
          price: Number(formData.price) || 0,
      })
        const response = await showtimesApi.createShowtime({
          id: showtimeId,
          movieId: formData.movieId!,
          screenId: formData.screenId!,
          date: formattedDate,
          time: formattedTime,
          format: formData.format!,
          price: Number(formData.price) || 0,
        })
        
        if (response.error) {
          console.error("Error creating showtime:", response.error)
          setErrorMessage(response.error)
          
          // Handle different error scenarios
          const errorMessage = response.error.toLowerCase()
          
          // Time conflict errors
          if (errorMessage.includes("time conflict") || errorMessage.includes("overlapping")) {
            setFormErrors({ 
              ...formErrors, 
              screenId: "Time conflict on this screen",
              time: "Time conflict with another showtime"
            })
          }
          // Screen-related errors
          else if (errorMessage.includes("screen not found")) {
            setFormErrors({ ...formErrors, screenId: "Selected screen not found" })
          }
          else if (errorMessage.includes("screen capacity")) {
            setFormErrors({ ...formErrors, screenId: "Screen capacity issue" })
          }
          else if (errorMessage.includes("screen type")) {
            setFormErrors({ ...formErrors, format: "Incompatible format" })
          }
          // Movie-related errors
          else if (errorMessage.includes("movie not found")) {
            setFormErrors({ ...formErrors, movieId: "Selected movie not found" })
          }
          return
        }
        
        if (response.data) {
          setShowtimes((prevShowtimes) => [...prevShowtimes, response.data as Showtime])
          setIsAddModalOpen(false)
        }
      } else if (isEditModalOpen && currentShowtime) {
        const response = await showtimesApi.updateShowtime(currentShowtime.id, {
          movieId: formData.movieId,
          screenId: formData.screenId,
          date: formattedDate,
          time: formattedTime,
          format: formData.format,
          price: Number(formData.price),
        })
        
        if (response.error) {
          console.error("Error updating showtime:", response.error)
          setErrorMessage(response.error)
          
          // Handle different error scenarios
          const errorMessage = response.error.toLowerCase()
          
          // Time conflict errors
          if (errorMessage.includes("time conflict") || errorMessage.includes("overlapping")) {
            setFormErrors({ 
              ...formErrors, 
              screenId: "Time conflict on this screen",
              time: "Time conflict with another showtime"
            })
          }
          // Screen-related errors
          else if (errorMessage.includes("screen not found")) {
            setFormErrors({ ...formErrors, screenId: "Selected screen not found" })
          }
          else if (errorMessage.includes("screen capacity")) {
            setFormErrors({ ...formErrors, screenId: "Screen capacity issue" })
          }
          else if (errorMessage.includes("screen type")) {
            setFormErrors({ ...formErrors, format: "Incompatible format" })
          }
          // Movie-related errors
          else if (errorMessage.includes("movie not found")) {
            setFormErrors({ ...formErrors, movieId: "Selected movie not found" })
          }
          return
        }
        
        if (response.data) {
          setShowtimes((prevShowtimes) =>
            prevShowtimes.map((showtime) => (showtime.id === currentShowtime.id ? response.data as Showtime : showtime))
          )
          setIsEditModalOpen(false)
        }
      }
    } catch (error: any) {
      console.error("Error saving showtime:", error)
      setErrorMessage("An unexpected error occurred. Please try again.")
    }
  }

  const handleConfirmDelete = async () => {
    if (currentShowtime) {
      try {
        setErrorMessage(null)
        
        // Check if trying to delete a past showtime
        const showtimeDate = new Date(currentShowtime.date.split("-").reverse().join("-"))
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (showtimeDate < today) {
          setErrorMessage("Cannot delete past showtimes.")
          return
        }

        const response = await showtimesApi.deleteShowtime(currentShowtime.id)
        if (response.status === 200) {
          setShowtimes((prevShowtimes) => prevShowtimes.filter((showtime) => showtime.id !== currentShowtime.id))
          setIsDeleteModalOpen(false)
        } else if (response.error) {
          console.error("Error deleting showtime:", response.error)
          
          const errorMessage = response.error.toLowerCase()
          
          if (errorMessage.includes("existing tickets") || errorMessage.includes("tickets sold")) {
            setErrorMessage("Cannot delete this showtime because tickets have already been sold. Please cancel all tickets first.")
          }
          else if (errorMessage.includes("past showtime")) {
            setErrorMessage("Cannot delete showtimes that have already occurred.")
          }
          else if (errorMessage.includes("not found")) {
            setErrorMessage("This showtime no longer exists.")
          }
          else {
            setErrorMessage(`Cannot delete showtime: ${response.error}`)
          }
        }
      } catch (error: any) {
        console.error("Error deleting showtime:", error)
        console.log("Full error object:", JSON.stringify(error, null, 2))
        
        if (error.response?.data?.error) {
          const errorMessage = error.response.data.error.toLowerCase()
          
          if (errorMessage.includes("existing tickets") || errorMessage.includes("tickets sold")) {
            setErrorMessage("Cannot delete this showtime because tickets have already been sold. Please cancel all tickets first.")
          }
          else if (errorMessage.includes("past showtime")) {
            setErrorMessage("Cannot delete showtimes that have already occurred.")
          }
          else if (errorMessage.includes("not found")) {
            setErrorMessage("This showtime no longer exists.")
          }
          else {
            setErrorMessage(`Error: ${error.response.data.error}`)
          }
        } else if (error instanceof Error) {
          setErrorMessage(`Error: ${error.message || "Unknown error occurred"}`)
        } else {
          setErrorMessage("An unexpected error occurred while deleting the showtime.")
        }
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Special handling for time input to ensure 24-hour format
    if (name === 'time') {
      // Allow typing but validate the format
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      if (value && !timeRegex.test(value)) {
        setFormErrors({ ...formErrors, time: "Please enter time in 24-hour format (HH:MM)" })
      } else {
        // Clear the error if the format is correct
        setFormErrors({ ...formErrors, time: "" })
      }
    }
    
    setFormData({ ...formData, [name]: value })
    
    // Clear error for this field when user changes it
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }
  }

  const getMovieTitle = (movieId: string) => {
    const movie = movies.find(m => m.id === movieId)
    return movie ? movie.title : "Unknown Movie"
  }

  const getScreenName = (screenId: string) => {
    const screen = screens.find(s => s.id === screenId)
    return screen ? screen.name : "Unknown Screen"
  }

  const columns = [
    {
      header: "Movie",
      accessorKey: "movieId" as keyof Showtime,
      cell: (row: Showtime) => getMovieTitle(row.movieId),
    },
    {
      header: "Screen",
      accessorKey: "screenId" as keyof Showtime,
      cell: (row: Showtime) => getScreenName(row.screenId),
    },
    {
      header: "Date",
      accessorKey: "date" as keyof Showtime,
    },
    {
      header: "Time",
      accessorKey: "time" as keyof Showtime,
    },
    {
      header: "Format",
      accessorKey: "format" as keyof Showtime,
    },
    {
      header: "Price",
      accessorKey: "price" as keyof Showtime,
      cell: (row: Showtime) => `$${row.price.toFixed(2)}`,
    },
  ]

  // Add this new function to convert time to 24-hour format
  const convertTo24HourFormat = (time: string): string => {
    // If time is already in 24-hour format (contains no AM/PM), return as is
    if (!time.toLowerCase().includes('am') && !time.toLowerCase().includes('pm')) {
      return time
    }

    // Split the time string into hours, minutes, and period
    const [timePart, period] = time.split(' ')
    const [hours, minutes] = timePart.split(':').map(Number)

    // Convert to 24-hour format
    let hours24 = hours
    if (period.toLowerCase() === 'pm' && hours !== 12) {
      hours24 = hours + 12
    } else if (period.toLowerCase() === 'am' && hours === 12) {
      hours24 = 0
    }

    // Format the time with leading zeros
    return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Showtimes</h1>
      </div>

      {errorMessage && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 dark:text-red-500">
          {errorMessage}
          <button 
            onClick={() => setErrorMessage(null)} 
            className="ml-2 font-medium underline hover:text-red-900 dark:hover:text-red-400"
          >
            Dismiss
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable
          data={showtimes}
          columns={columns}
          onAdd={handleAddShowtime}
          onEdit={handleEditShowtime}
          onDelete={handleDeleteShowtime}
          searchPlaceholder="Search showtimes..."
        />
      )}

      {/* Add Showtime Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Showtime" size="md">
        <div className="space-y-4">
          <FormField label="Movie" id="movieId" required>
            <select
              id="movieId"
              name="movieId"
              value={formData.movieId || ""}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-md border ${
                formErrors.movieId ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100`}
              required
            >
              <option value="">Select a movie</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
            {formErrors.movieId && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">{formErrors.movieId}</p>
            )}
          </FormField>

          <FormField label="Screen" id="screenId" required>
            <select
              id="screenId"
              name="screenId"
              value={formData.screenId || ""}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-md border ${
                formErrors.screenId ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
              } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100`}
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
                value={formData.date || ""}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  formErrors.date ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100`}
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
                onChange={handleInputChange}
                placeholder="HH:MM (e.g., 14:30)"
                className={`w-full px-3 py-2 rounded-md border ${
                  formErrors.time ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100`}
                required
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
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  formErrors.format ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100`}
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
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 rounded-md border ${
                  formErrors.price ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100`}
                required
              />
              {formErrors.price && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{formErrors.price}</p>
              )}
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveShowtime}
              className="px-4 py-2 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Add Showtime
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Showtime Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Showtime" size="md">
        <div className="space-y-4">
          <FormField label="Movie" id="edit-movieId" required>
            <select
              id="edit-movieId"
              name="movieId"
              value={formData.movieId || ""}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-md border ${formErrors.movieId ? 'border-red-500' : 'border-input'} bg-background`}
              required
            >
              <option value="">Select a movie</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
            {formErrors.movieId && (
              <p className="mt-1 text-xs text-red-500">{formErrors.movieId}</p>
            )}
          </FormField>

          <FormField label="Screen" id="edit-screenId" required>
            <select
              id="edit-screenId"
              name="screenId"
              value={formData.screenId || ""}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-md border ${formErrors.screenId ? 'border-red-500' : 'border-input'} bg-background`}
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
              <p className="mt-1 text-xs text-red-500">{formErrors.screenId}</p>
            )}
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date" id="edit-date" required>
              <input
                type="date"
                id="edit-date"
                name="date"
                value={formData.date || ""}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  formErrors.date ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100`}
                required
              />
              {formErrors.date ? (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{formErrors.date}</p>
              ) : (
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Select a date for the showtime</p>
              )}
            </FormField>

            <FormField label="Time (24-hour format)" id="edit-time" required>
              <input
                type="text"
                id="edit-time"
                name="time"
                value={formData.time || ""}
                onChange={handleInputChange}
                placeholder="HH:MM (e.g., 14:30)"
                className={`w-full px-3 py-2 rounded-md border ${
                  formErrors.time ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                } bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100`}
                required
              />
              {formErrors.time ? (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{formErrors.time}</p>
              ) : (
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Enter time in 24-hour format (e.g., 14:30 for 2:30 PM)</p>
              )}
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Format" id="edit-format" required>
              <select
                id="edit-format"
                name="format"
                value={formData.format || "TwoD"}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md border ${formErrors.format ? 'border-red-500' : 'border-input'} bg-background`}
                required
              >
                {movieFormats.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
              {formErrors.format && (
                <p className="mt-1 text-xs text-red-500">{formErrors.format}</p>
              )}
            </FormField>

            <FormField label="Price" id="edit-price" required>
              <input
                type="number"
                id="edit-price"
                name="price"
                value={formData.price || ""}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 rounded-md border ${formErrors.price ? 'border-red-500' : 'border-input'} bg-background`}
                required
              />
              {formErrors.price && (
                <p className="mt-1 text-xs text-red-500">{formErrors.price}</p>
              )}
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-md border border-input bg-background hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveShowtime}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Update Showtime
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Showtime"
        message={`Are you sure you want to delete this showtime? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
} 