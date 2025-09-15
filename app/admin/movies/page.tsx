"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Film, Star, Search, X, ChevronDown, ChevronUp, Edit, Trash2, Calendar, Tag, User } from "lucide-react"
import type { Movie, MovieGenre, CastMember, Director } from "@/types/types"
import type { ApiResponse } from "@/lib/client"
import { moviesApi } from "@/lib/endpoints/movies"
import { castMembersApi } from "@/lib/endpoints/cast-members"
import { directorsApi } from "@/lib/endpoints/directors"
import toast from "react-hot-toast"

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
  "SciFi",
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
      status: "coming_soon",
      hidden: false,
    })
    setSelectedCast([])
    setCurrentMovie(null)
    setIsModalOpen(true)
  }

  const handleEditMovie = (movie: MovieWithCast) => {
    setCurrentMovie(movie)
    setFormData({ 
      ...movie,
      genre: movie.genre || [], // Ensure genre is properly set
    })

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
      setErrorMessage(null);

      let response: ApiResponse<MovieWithCast>;

      if (!currentMovie) {
        // Create new movie - use cast array format
        const moviePayload = {
          ...formData,
          duration: formData.duration || "",
          cast: selectedCast.map((c) => ({
            castMemberId: c.castMemberId,
            character: c.character || "Unknown Character",
          })),
        };
        
        response = await moviesApi.createMovie(moviePayload as any);
      } else {
        // Update existing movie - use castIds and characters format
        const { directorId, ...updateData } = formData;
        
        // Create characters object mapping castMemberId to character name
        const characters: { [key: string]: string } = {};
        selectedCast.forEach((c) => {
          characters[c.castMemberId] = c.character || "Unknown Character";
        });

        const updatePayload = {
          ...updateData,
          duration: updateData.duration || "",
          castIds: selectedCast.map((c) => c.castMemberId),
          characters: characters,
        };
        
        response = await moviesApi.updateMovie(currentMovie.id, updatePayload as any);
      }

      if (response.error) {
        console.error("Error saving movie:", response.error);
        const errorMsg = `Failed to save movie: ${response.error}`;
        setErrorMessage(errorMsg);
        toast.error(errorMsg)
        return;
      }

      // Check if the operation was successful (either has data or status is ok)
      if (response.data || (response.status >= 200 && response.status < 300)) {
        const movieData = response.data;
        console.log("Movie save response:", response); // Debug log
        
        if (!currentMovie) {
          // Creating new movie
          if (movieData) {
            setMovies((prev) => [...prev, movieData as MovieWithCast]);
          }
          toast.success(`"${movieData?.title || formData.title}" has been successfully added to the cinema.`)
        } else {
          // Updating existing movie
          if (movieData) {
            setMovies((prev) =>
              prev.map((m) =>
                m.id === currentMovie.id ? (movieData as MovieWithCast) : m
              )
            );
          }
          toast.success(`"${movieData?.title || currentMovie.title}" has been successfully updated.`)
        }
        
        setIsModalOpen(false);
        
        // If no data in response, refetch to ensure we have latest data
        if (!movieData) {
          fetchMovies();
        }
      }
    } catch (error) {
      console.error("Error saving movie:", error);
      const errorMsg = "An unexpected error occurred. Please try again.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg)
    }
  };

  const handleConfirmDelete = async () => {
    if (currentMovie) {
      try {
        setErrorMessage(null)
        const response = await moviesApi.deleteMovie(currentMovie.id)
        
        if (response.error) {
          console.error("Error deleting movie:", response.error)
          const errorMsg = `Cannot delete ${currentMovie.title}: ${response.error}`;
          setErrorMessage(errorMsg)
          toast.error(errorMsg)
          return
        }
        
        if (response.status === 200) {
          setMovies((prev) => prev.filter((m) => m.id !== currentMovie.id))
          setIsDeleteModalOpen(false)
          toast.success(`"${currentMovie.title}" has been successfully deleted.`)
        }
      } catch (error) {
        console.error("Error deleting movie:", error)
        const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred";
        setErrorMessage(errorMsg)
        toast.error(errorMsg)
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
    const newGenres = currentGenres.includes(genre)
      ? currentGenres.filter((g) => g !== genre)
      : [...currentGenres, genre]
    
      setFormData({
        ...formData,
      genre: newGenres
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
    // Simply update the local state - changes will be saved when the movie is saved
    setSelectedCast(prev =>
      prev.map(c =>
        c.castMemberId === castMemberId ? { ...c, character } : c
      )
    )
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Movies</h1>
        <button
          onClick={handleAddMovie}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-red-500/25 flex items-center gap-2"
        >
          <Film className="h-5 w-5" />
          Add Movie
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 mb-6 text-sm text-red-800 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 dark:text-red-400 border-l-4 border-red-500 shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="font-medium">{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="ml-auto px-3 py-1 text-xs font-semibold rounded-lg bg-red-100 dark:bg-red-800/50 hover:bg-red-200 dark:hover:bg-red-700/50 transition-colors duration-200"
            >
              Dismiss
            </button>
          </div>
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
            className="w-full px-5 py-4 pl-12 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm text-zinc-900 dark:text-zinc-100 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 hover:bg-white dark:hover:bg-zinc-800 shadow-sm"
          />
          <Search className="absolute left-4 top-4 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-600 dark:border-zinc-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-lg bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
              <thead className="bg-gradient-to-r from-zinc-50/80 to-red-50/50 dark:from-zinc-800/80 dark:to-red-900/20">
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
                  <tr key={movie.id} className="hover:bg-gradient-to-r hover:from-red-50/30 hover:to-orange-50/30 dark:hover:from-red-900/10 dark:hover:to-orange-900/10 transition-all duration-200">
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
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 hover:scale-110"
          >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
          </button>
                      <button
                        onClick={() => handleDeleteMovie(movie)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-110"
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

      {/* Enhanced Modal for Movie Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
              onClick={() => setIsModalOpen(false)}
            ></div>
            <div className="relative bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-zinc-700/50 max-w-4xl w-full mx-auto z-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-zinc-700/50 bg-gradient-to-r from-red-50/50 to-orange-50/50 dark:from-red-900/10 dark:to-orange-900/10 rounded-t-2xl">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                  {currentMovie ? "Edit Movie" : "Add New Movie"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-all duration-200 hover:scale-110 hover:rotate-90 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </button>
        </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-red-300 dark:scrollbar-thumb-red-700 scrollbar-track-transparent">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Title and Year */}
                  <div>
                    <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                      <Film className="h-4 w-4 text-red-500" />
                      Title <span className="text-red-500">*</span>
                    </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm text-zinc-900 dark:text-zinc-100 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 hover:bg-white dark:hover:bg-zinc-800"
                required
              />
                  </div>
                  <div>
                    <label htmlFor="year" className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                      <Calendar className="h-4 w-4 text-red-500" />
                      Year <span className="text-red-500">*</span>
                    </label>
              <input
                type="text"
                id="year"
                name="year"
                value={formData.year || ""}
                onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm text-zinc-900 dark:text-zinc-100 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 hover:bg-white dark:hover:bg-zinc-800"
                required
              />
                  </div>
          </div>

                {/* Description */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2"
                  >
                    <Edit className="h-4 w-4 text-red-500" />
                    Description <span className="text-red-500">*</span>
                  </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm text-zinc-900 dark:text-zinc-100 resize-none focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 hover:bg-white dark:hover:bg-zinc-800"
              required
            />
                </div>

                {/* Genres */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                    <Tag className="h-4 w-4 text-red-500" />
                    Genres <span className="text-red-500">*</span>
                  </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-xl border border-zinc-200 dark:border-zinc-700">
              {ALL_GENRES.map((genre) => (
                      <label key={genre} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-zinc-700/50">
                  <input
                    type="checkbox"
                          checked={formData.genre?.some(g => g === genre) || false}
                    onChange={() => handleGenreChange(genre)}
                          className="rounded-md border-2 border-zinc-300 dark:border-zinc-600 text-red-600 focus:ring-red-500 focus:ring-2 transition-all duration-200 hover:border-red-400"
                  />
                  <span className="font-medium">{genre}</span>
                </label>
              ))}
            </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Rating and Duration */}
                  <div>
                    <label htmlFor="rating" className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                      <Star className="h-4 w-4 text-red-500" />
                      Rating
                    </label>
              <input
                type="text"
                id="rating"
                name="rating"
                value={formData.rating || ""}
                onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm text-zinc-900 dark:text-zinc-100 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 hover:bg-white dark:hover:bg-zinc-800"
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
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                    <User className="h-5 w-5 text-red-500" />
                    Cast Members
                  </h3>
            
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
                  <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-red-300 dark:scrollbar-thumb-red-700 scrollbar-track-transparent">
                    {selectedCast.map((cast) => (
                      <div
                        key={cast.castMemberId}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-zinc-100/80 to-white/50 dark:from-zinc-800/80 dark:to-zinc-700/50 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-all duration-200"
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
                    <label htmlFor="status" className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                      <ChevronDown className="h-4 w-4 text-red-500" />
                      Status <span className="text-red-500">*</span>
                    </label>
              <select
                id="status"
                name="status"
                value={formData.status || "coming_soon"}
                onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm text-zinc-900 dark:text-zinc-100 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 hover:bg-white dark:hover:bg-zinc-800"
                required
              >
                <option value="coming_soon">Coming Soon</option>
                <option value="now_showing">Now Showing</option>
              </select>
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer p-3 rounded-xl hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-all duration-200">
                <input
                  type="checkbox"
                  id="hidden"
                  name="hidden"
                  checked={formData.hidden || false}
                  onChange={handleCheckboxChange}
                        className="rounded-lg border-2 border-zinc-300 dark:border-zinc-600 text-red-600 focus:ring-red-500 focus:ring-2 transition-all duration-200 hover:border-red-400"
                />
                <span className="select-none">Hide this movie from public view</span>
              </label>
                  </div>
                </div>
          </div>

              <div className="flex justify-end gap-4 p-6 border-t border-white/10 dark:border-zinc-700/50 bg-gradient-to-r from-zinc-50/50 to-white/50 dark:from-zinc-800/30 dark:to-zinc-900/30 rounded-b-2xl">
            <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-200 font-medium hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveMovie}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-red-500/25"
            >
                  {currentMovie ? "Update Movie" : "Save Movie"}
            </button>
          </div>
        </div>
          </div>
            </div>
      )}

      {/* Enhanced Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
              onClick={() => setIsDeleteModalOpen(false)}
            ></div>
            <div className="relative bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-zinc-700/50 max-w-md w-full mx-auto z-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                    <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Delete Movie</h3>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 mb-6 bg-red-50/50 dark:bg-red-900/10 p-4 rounded-xl border-l-4 border-red-500">
                  Are you sure you want to delete <span className="font-semibold text-red-600 dark:text-red-400">"{currentMovie?.title}"</span>? This action cannot be undone and will permanently remove all associated data.
                </p>
                <div className="flex justify-end gap-4">
            <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-6 py-3 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-200 font-medium hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
                    onClick={handleConfirmDelete}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-red-500/25"
            >
                    Delete Movie
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
