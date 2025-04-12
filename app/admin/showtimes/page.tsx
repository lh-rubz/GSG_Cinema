"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { Modal } from "@/components/modal"
import { ConfirmDialog } from "@/components/confirm-dialog"

import type { Showtime, Movie, Screen } from "@/types/types"
import { showtimesApi } from "@/lib/endpoints/showtimes"
import { moviesApi } from "@/lib/endpoints/movies"
import { screensApi } from "@/lib/endpoints/screens"
import toast from "react-hot-toast"
import { ShowtimeForm } from "./components/showtimesForms"

export default function ShowtimesPage() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [screens, setScreens] = useState<Screen[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentShowtime, setCurrentShowtime] = useState<Showtime | null>(null)
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
  const [mode, setMode] = useState<"add" | "edit">("add")

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

  const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(time)
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
    
    if (!formData.time || !validateTimeFormat(formData.time)) {
      errors.time = "Valid time in HH:MM (24-hour) format is required"
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
    setMode("add")
    setIsModalOpen(true)
  }

  const handleEditShowtime = (showtime: Showtime) => {
    setCurrentShowtime(showtime)
    setFormData({ ...showtime })
    setFormErrors({})
    setErrorMessage(null)
    setMode("edit")
    setIsModalOpen(true)
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
      
      if (!validateForm()) {
        return
      }

      // Format time to ensure HH:MM format
      const time = formData.time || ""
      const [hours, minutes] = time.split(':')
      const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`

      // Convert date from yyyy-mm-dd to dd-mm-yyyy
      const date = new Date(formData.date || "")
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      const formattedDate = `${day}-${month}-${year}`

      // Additional validations
      const selectedDate = new Date(formData.date || "")
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        setFormErrors({ ...formErrors, date: "Cannot create showtimes for past dates" })
        toast.error("Please select a future date for the showtime.")
        return
      }

      const selectedMovie = movies.find(m => m.id === formData.movieId)
      if (selectedMovie?.hidden) {
        setFormErrors({ ...formErrors, movieId: "Selected movie is currently hidden" })
        toast.error("Cannot create showtime for a hidden movie. Please select an active movie.")
        return
      }

      if (selectedMovie?.status !== "now_showing") {
        setFormErrors({ ...formErrors, movieId: "Movie is not currently showing" })
        toast.error("Can only create showtimes for movies that are currently showing.")
        return
      }
      
      if (mode === "add") {
        const showtimeId = `sh${Date.now()}`
        
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
          toast.error(response.error)
          return
        }
        
        if (response.data) {
          setShowtimes((prevShowtimes) => [...prevShowtimes, response.data as Showtime])
          setIsModalOpen(false)
          toast.success("Showtime added successfully!")
        }
      } else if (mode === "edit" && currentShowtime) {
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
          toast.error(response.error)
          return
        }
        
        if (response.data) {
          setShowtimes((prevShowtimes) =>
            prevShowtimes.map((showtime) => 
              showtime.id === currentShowtime.id ? response.data as Showtime : showtime
            )
          )
          setIsModalOpen(false)
          toast.success("Showtime updated successfully!")
        }
      }
    } catch (error: any) {
      console.error("Error saving showtime:", error)
      toast.error("An unexpected error occurred. Please try again.")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Clear error for this field when user changes it
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }
    
    // Handle date format conversion
    if (name === "date") {
      // Convert from yyyy-mm-dd to dd-mm-yyyy for storage
      const [year, month, day] = value.split("-")
      const formattedDate = `${month}-${day}-${year}`
      setFormData({ ...formData, [name]: formattedDate })
    } else {
      setFormData({ ...formData, [name]: value })
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
          toast.error("Cannot delete past showtimes.")
          return
        }

        const response = await showtimesApi.deleteShowtime(currentShowtime.id)
        if (response.status === 200) {
          setShowtimes((prevShowtimes) => 
            prevShowtimes.filter((showtime) => showtime.id !== currentShowtime.id)
          )
          setIsDeleteModalOpen(false)
          toast.success("Showtime deleted successfully!")
        } else if (response.error) {
          console.error("Error deleting showtime:", response.error)
          toast.error(`Cannot delete showtime: ${response.error}`)
        }
      } catch (error: any) {
        console.error("Error deleting showtime:", error)
        toast.error("An unexpected error occurred while deleting the showtime.")
      }
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

      {/* Combined Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={mode === "add" ? "Add New Showtime" : "Edit Showtime"} 
        size="md"
      >
        <ShowtimeForm
          formData={formData}
          formErrors={formErrors}
          movies={movies}
          screens={screens}
          onSubmit={handleSaveShowtime}
          onCancel={() => setIsModalOpen(false)}
              onChange={handleInputChange}
          mode={mode}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Showtime"
        message={`Are you sure you want to delete the showtime for ${currentShowtime ? getMovieTitle(currentShowtime.movieId) : ''}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
} 