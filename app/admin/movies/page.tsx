"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Film, Star, Search, X, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react"
import type { Movie, MovieGenre, CastMember, Director } from "@/types/types"
import type { ApiResponse } from "@/lib/client"
import { moviesApi } from "@/lib/endpoints/movies"
import { castMembersApi } from "@/lib/endpoints/cast-members"
import { directorsApi } from "@/lib/endpoints/directors"

interface MovieWithCast extends Movie {
  cast?: Array<{
    castMemberId: string
    character: string
    castMember?: CastMember
  }>
}

// Sample data
const ALL_GENRES: MovieGenre[] = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Crime",
  "Animation",
  "Documentary",
  "Family",
  "Western",
  "Arabic",
]

export default function MoviesPage() {
  const [movies, setMovies] = useState<MovieWithCast[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentMovie, setCurrentMovie] = useState<MovieWithCast | null>(null)
  const [formData, setFormData] = useState<Partial<Movie>>({
    title: "",
    year: "",
    genre: [],
    rating: "",
    description: "",
    image: "",
    directorId: "",
    duration: "",
    trailer: "",
    releaseDate: "",
    castIds: [],
    status: "coming_soon",
    hidden: false,
  })
  const [castMembers, setCastMembers] = useState<CastMember[]>([])
  const [directors, setDirectors] = useState<Director[]>([])
  const [selectedCast, setSelectedCast] = useState<
    Array<{
      castMemberId: string
      character: string
      castMember?: CastMember
    }>
  >([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [searchCastQuery, setSearchCastQuery] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof Movie>("title")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    fetchMovies()
    fetchCastMembers()
    fetchDirectors()
  }, [])

  const fetchMovies = async () => {
    try {
      setIsLoading(true)
      const response = await moviesApi.getMovies()
      if (response.data) {
        setMovies(response.data)
      }
    } catch (error) {
      console.error("Error fetching movies:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCastMembers = async () => {
    try {
      const response = await castMembersApi.getCastMembers()
      if (response.data) {
        setCastMembers(response.data)
      }
    } catch (error) {
      console.error("Error fetching cast members:", error)
    }
  }

  const fetchDirectors = async () => {
    try {
      const response = await directorsApi.getDirectors()
      if (response.data) {
        setDirectors(response.data)
      }
    } catch (error) {
      console.error("Error fetching directors:", error)
    }
  }

  const filteredCastMembers = useMemo(() => {
    return castMembers.filter(
      (cast) =>
        cast.name.toLowerCase().includes(searchCastQuery.toLowerCase()) &&
        !selectedCast.some((c) => c.castMemberId === cast.id),
    )
  }, [castMembers, searchCastQuery, selectedCast])

  const filteredMovies = useMemo(() => {
    return movies
      .filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (movie.genre && movie.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))),
      )
      .sort((a, b) => {
        const fieldA = a[sortField] || ""
        const fieldB = b[sortField] || ""

        if (typeof fieldA === "string" && typeof fieldB === "string") {
          return sortDirection === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
        }

        return 0
      })
  }, [movies, searchQuery, sortField, sortDirection])

  const handleSort = (field: keyof Movie) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleAddMovie = () => {
    setFormData({
      title: "",
      year: "",
      genre: [],
      rating: "",
      description: "",
      image: "",
      directorId: "",
      duration: "",
      trailer: "",
      releaseDate: "",
      castIds: [],
      status: "coming_soon",
      hidden: false,
    })
    setSelectedCast([])
    setCurrentMovie(null)
    setIsModalOpen(true)
  }

  const handleEditMovie = (movie: MovieWithCast) => {
    setCurrentMovie(movie)
    setFormData({ ...movie })

    const initialCast =
      movie.cast?.map((c) => ({
        castMemberId: c.castMemberId,
        character: c.character,
        castMember: c.castMember,
      })) || []

    setSelectedCast(initialCast)
    setIsModalOpen(true)
  }

  const handleDeleteMovie = (movie: Movie) => {
    setCurrentMovie(movie)
    setIsDeleteModalOpen(true)
  }

  const handleSaveMovie = async () => {
    try {
      setErrorMessage(null)

      const moviePayload = {
        ...formData,
        duration: formData.duration || "",
        cast: selectedCast.map((c) => ({
          castMemberId: c.castMemberId,
          character: c.character || "",
        })),
      }

      let response: ApiResponse<MovieWithCast>

      if (!currentMovie) {
        // Create new movie
        response = await moviesApi.createMovie(moviePayload as any)
      } else {
        // Update existing movie
        const { directorId, ...updateData } = formData
        response = await moviesApi.updateMovie(currentMovie.id, {
          ...updateData,
          duration: updateData.duration || "",
          cast: selectedCast.map((c) => ({
            castMemberId: c.castMemberId,
            character: c.character || "",
          })),
        } as any)
      }

      if (response.error) {
        console.error("Error saving movie:", response.error)
        setErrorMessage(`Failed to save movie: ${response.error}`)
        return
      }

      if (response.data) {
        if (!currentMovie) {
          setMovies((prev) => [...prev, response.data as MovieWithCast])
        } else {
          setMovies((prev) => 
            prev.map((m) => 
              m.id === currentMovie.id 
                ? { 
                    ...response.data as MovieWithCast,
                    cast: selectedCast
                  } 
                : m
            )
          )
        }
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error("Error saving movie:", error)
      setErrorMessage("An unexpected error occurred. Please try again.")
    }
  }

  const handleConfirmDelete = async () => {
    if (currentMovie) {
      try {
        setErrorMessage(null)
        const response = await moviesApi.deleteMovie(currentMovie.id)

        if (response.error) {
          console.error("Error deleting movie:", response.error)
          setErrorMessage(`Cannot delete ${currentMovie.title}: ${response.error}`)
          return
        }

        if (response.status === 200) {
          setMovies((prev) => prev.filter((m) => m.id !== currentMovie.id))
          setIsDeleteModalOpen(false)
        }
      } catch (error) {
        console.error("Error deleting movie:", error)
        setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred")
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData({ ...formData, [name]: checked })
  }

  const handleGenreChange = (genre: MovieGenre) => {
    const currentGenres = formData.genre || []
    setFormData({
      ...formData,
      genre: currentGenres.includes(genre) ? currentGenres.filter((g) => g !== genre) : [...currentGenres, genre],
    })
  }

  const handleAddCastMember = (castMemberId: string) => {
    const castMember = castMembers.find((c) => c.id === castMemberId)
    if (castMember) {
      setSelectedCast((prev) => [
        ...prev,
        {
          castMemberId,
          character: "",
          castMember,
        },
      ])
      setSearchCastQuery("")
    }
  }

  const handleRemoveCastMember = (castMemberId: string) => {
    setSelectedCast((prev) => prev.filter((c) => c.castMemberId !== castMemberId))
  }

  const handleCastCharacterChange = (castMemberId: string, character: string) => {
    setSelectedCast((prev) => prev.map((c) => (c.castMemberId === castMemberId ? { ...c, character } : c)))
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Movies</h1>
        <button
          onClick={handleAddMovie}
          className="px-4 py-2 rounded-md bg-zinc-600 text-white hover:bg-zinc-700 transition-colors dark:bg-zinc-500 dark:hover:bg-zinc-600"
        >
          Add Movie
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900/30 dark:text-red-400">
          {errorMessage}
          <button
            onClick={() => setErrorMessage(null)}
            className="ml-2 font-medium underline hover:text-red-900 dark:hover:text-red-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search and Table */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-600 dark:border-zinc-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
              <thead className="bg-zinc-50 dark:bg-zinc-800">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center">
                      Title
                      {sortField === "title" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("genre")}
                  >
                    <div className="flex items-center">
                      Genre
                      {sortField === "genre" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("rating")}
                  >
                    <div className="flex items-center">
                      Rating
                      {sortField === "rating" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("duration")}
                  >
                    <div className="flex items-center">
                      Duration
                      {sortField === "duration" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortField === "status" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("hidden")}
                  >
                    <div className="flex items-center">
                      Visibility
                      {sortField === "hidden" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-700">
                {filteredMovies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {movie.image ? (
                          <div className="w-10 h-14 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                            <img
                              src={movie.image || "/placeholder.svg"}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-14 rounded flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                            <Film className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-zinc-100">{movie.title}</div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">{movie.year}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300">
                      {movie.genre.join(", ")}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        <span className="text-zinc-700 dark:text-zinc-300">{movie.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300">
                      {movie.duration}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          movie.status === "now_showing"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
                        }`}
                      >
                        {movie.status === "now_showing" ? "Now Showing" : "Coming Soon"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          movie.hidden
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                        }`}
                      >
                        {movie.hidden ? "Hidden" : "Visible"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditMovie(movie)}
                        className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-400 mr-3"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteMovie(movie)}
                        className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredMovies.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                      No movies found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Modal for Movie Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setIsModalOpen(false)}
            ></div>
            <div className="relative bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-4xl w-full mx-auto z-10">
              <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {currentMovie ? "Edit Movie" : "Add New Movie"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Title and Year */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="year"
                      name="year"
                      value={formData.year || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 resize-none"
                    required
                  />
                </div>

                {/* Genres */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Genres <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {ALL_GENRES.map((genre) => (
                      <label key={genre} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                        <input
                          type="checkbox"
                          checked={(formData.genre || []).includes(genre)}
                          onChange={() => handleGenreChange(genre)}
                          className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-500"
                        />
                        {genre}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Rating and Duration */}
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Rating
                    </label>
                    <input
                      type="text"
                      id="rating"
                      name="rating"
                      value={formData.rating || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                      Duration
                    </label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={formData.duration || ""}
                      onChange={handleInputChange}
                      placeholder="e.g. 120 min"
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Image URL and Trailer URL */}
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={formData.image || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="trailer"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                      Trailer URL
                    </label>
                    <input
                      type="text"
                      id="trailer"
                      name="trailer"
                      value={formData.trailer || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Release Date and Director */}
                  <div>
                    <label
                      htmlFor="releaseDate"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                      Release Date
                    </label>
                    <input
                      type="date"
                      id="releaseDate"
                      name="releaseDate"
                      value={formData.releaseDate || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="directorId"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                      Director <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="directorId"
                      name="directorId"
                      value={formData.directorId || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                      required
                      disabled={!!currentMovie}
                    >
                      <option value="">Select a director</option>
                      {directors.map((director) => (
                        <option key={director.id} value={director.id}>
                          {director.name}
                        </option>
                      ))}
                    </select>
                    {formData.directorId && (
                      <div className="mt-2 flex items-center gap-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                        {directors.find((d) => d.id === formData.directorId)?.image && (
                          <img
                            src={directors.find((d) => d.id === formData.directorId)?.image || "/placeholder.svg"}
                            alt="Director"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <span className="text-zinc-900 dark:text-zinc-100">
                          {directors.find((d) => d.id === formData.directorId)?.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cast Members Section */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">Cast Members</h3>

                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder="Search cast members..."
                      value={searchCastQuery}
                      onChange={(e) => setSearchCastQuery(e.target.value)}
                      className="w-full px-3 py-2 pl-10 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-zinc-500 dark:text-zinc-400" />

                    {searchCastQuery && filteredCastMembers.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredCastMembers.map((cast) => (
                          <div
                            key={cast.id}
                            onClick={() => handleAddCastMember(cast.id)}
                            className="flex items-center gap-2 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
                          >
                            {cast.image && (
                              <img
                                src={cast.image || "/placeholder.svg"}
                                alt={cast.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                            <span className="text-zinc-900 dark:text-zinc-100">{cast.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected Cast Members */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedCast.map((cast) => (
                      <div
                        key={cast.castMemberId}
                        className="flex items-center gap-3 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md"
                      >
                        {cast.castMember?.image && (
                          <img
                            src={cast.castMember.image || "/placeholder.svg"}
                            alt={cast.castMember.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-zinc-900 dark:text-zinc-100">
                            {cast.castMember?.name || "Unknown"}
                          </div>
                          <input
                            type="text"
                            placeholder="Character name"
                            value={cast.character}
                            onChange={(e) => handleCastCharacterChange(cast.castMemberId, e.target.value)}
                            className="w-full px-2 py-1 text-sm rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveCastMember(cast.castMemberId)}
                          className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 p-1"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </div>
                    ))}
                    {selectedCast.length === 0 && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">No cast members selected</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Status and Visibility */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status || "coming_soon"}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                      required
                    >
                      <option value="coming_soon">Coming Soon</option>
                      <option value="now_showing">Now Showing</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                      <input
                        type="checkbox"
                        id="hidden"
                        name="hidden"
                        checked={formData.hidden || false}
                        onChange={handleCheckboxChange}
                        className="rounded border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-500"
                      />
                      <span>Hide this movie</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-4 border-t border-zinc-200 dark:border-zinc-700">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMovie}
                  className="px-4 py-2 rounded-md bg-zinc-600 text-white hover:bg-zinc-700 transition-colors dark:bg-zinc-500 dark:hover:bg-zinc-600"
                >
                  {currentMovie ? "Update Movie" : "Save Movie"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setIsDeleteModalOpen(false)}
            ></div>
            <div className="relative bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-md w-full mx-auto z-10">
              <div className="p-6">
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">Delete Movie</h3>
                <p className="text-zinc-700 dark:text-zinc-300 mb-6">
                  Are you sure you want to delete "{currentMovie?.title}"? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors dark:bg-red-500 dark:hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
