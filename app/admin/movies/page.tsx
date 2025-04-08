"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Film, Star } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Modal } from "@/components/modal"
import { FormField } from "@/components/form-field"
import { ConfirmDialog } from "@/components/confirm-dialog"
import type { Movie, MovieGenre } from "@/types/types"
import { moviesApi } from "@/lib/endpoints/movies"
import type { ApiResponse } from "@/lib/client"

interface MovieWithCast extends Movie {
  cast?: Array<{
    castMemberId: string;
    character: string;
  }>;
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
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
  const [castMembers, setCastMembers] = useState<Array<{ castMemberId: string; character: string }>>([])
  const [newCastMember, setNewCastMember] = useState({ castMemberId: "", character: "" })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchMovies()
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
    setIsAddModalOpen(true)
  }

  const handleEditMovie = (movie: MovieWithCast) => {
    setCurrentMovie(movie)
    setFormData({ ...movie })
    if (movie.cast && Array.isArray(movie.cast)) {
      const movieCast = movie.cast.map(c => ({
        castMemberId: c.castMemberId,
        character: c.character || "Unknown Character"
      }))
      setCastMembers(movieCast)
    } else {
      setCastMembers([])
    }
    
    setIsEditModalOpen(true)
  }

  const handleDeleteMovie = (movie: Movie) => {
    setCurrentMovie(movie)
    setIsDeleteModalOpen(true)
  }

  const handleSaveMovie = async () => {
    try {
      setErrorMessage(null)
      
      if (isAddModalOpen) {
        const response = await moviesApi.createMovie({
          ...formData,
          duration: formData.duration || "",
          cast: castMembers
        } as any)
        
        if (response.error) {
          console.error("Error creating movie:", response.error)
          setErrorMessage(`Failed to create movie: ${response.error}`)
          return
        }
        
        if (response.data && 'id' in response.data) {
          setMovies((prevMovies) => [...prevMovies, response.data as MovieWithCast])
          setIsAddModalOpen(false)
          setCastMembers([])
        }
      } else if (isEditModalOpen && currentMovie) {
        const { directorId, castIds, ...updateData } = formData
        
        const response = await moviesApi.updateMovie(currentMovie.id, {
          ...updateData,
          duration: updateData.duration || ""
        } as any)
        
        if (response.error) {
          console.error("Error updating movie:", response.error)
          setErrorMessage(`Failed to update movie: ${response.error}`)
          return
        }
        
        if (response.data && 'id' in response.data) {
          setMovies((prevMovies) =>
            prevMovies.map((movie) => (movie.id === currentMovie.id ? (response.data as MovieWithCast) : movie))
          )
          setIsEditModalOpen(false)
          setCastMembers([])
        }
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
          setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== currentMovie.id))
          setIsDeleteModalOpen(false)
        }
      } catch (error) {
        console.error("Error deleting movie:", error)
        
        if (error instanceof Error) {
          setErrorMessage(`Error: ${error.message || "Unknown error occurred"}`)
        } else {
          setErrorMessage("An unexpected error occurred while deleting the movie.")
        }
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
    if (currentGenres.includes(genre)) {
      setFormData({
        ...formData,
        genre: currentGenres.filter((g) => g !== genre),
      })
    } else {
      setFormData({
        ...formData,
        genre: [...currentGenres, genre],
      })
    }
  }

  const handleAddCastMember = () => {
    if (newCastMember.castMemberId) {
      setCastMembers([...castMembers, newCastMember])
      setFormData({
        ...formData,
        castIds: [...(formData.castIds || []), newCastMember.castMemberId]
      })
      setNewCastMember({ castMemberId: "", character: "" })
    }
  }

  const handleRemoveCastMember = (index: number) => {
    const updatedCastMembers = [...castMembers]
    const removedMember = updatedCastMembers.splice(index, 1)[0]
    setCastMembers(updatedCastMembers)
    
    const updatedCastIds = (formData.castIds || []).filter(id => id !== removedMember.castMemberId)
    setFormData({
      ...formData,
      castIds: updatedCastIds
    })
  }

  const handleNewCastMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewCastMember({ ...newCastMember, [name]: value })
  }

  const columns = [
    {
      header: "Title",
      accessorKey: "title" as keyof Movie,
      cell: (row: Movie) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <div className="w-10 h-14 rounded overflow-hidden bg-muted">
              <img src={row.image || "/placeholder.svg"} alt={row.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-14 rounded flex items-center justify-center bg-muted">
              <Film className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <div className="font-medium">{row.title}</div>
            <div className="text-xs text-muted-foreground">{row.year}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Genre",
      accessorKey: "genre" as keyof Movie,
      cell: (row: Movie) => row.genre.join(", "),
    },
    {
      header: "Rating",
      accessorKey: "rating" as keyof Movie,
      cell: (row: Movie) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
          <span>{row.rating}</span>
        </div>
      ),
    },
    {
      header: "Duration",
      accessorKey: "duration" as keyof Movie,
    },
    {
      header: "Status",
      accessorKey: "status" as keyof Movie,
      cell: (row: Movie) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            row.status === "now_showing"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
              : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
          }`}
        >
          {row.status === "now_showing" ? "Now Showing" : "Coming Soon"}
        </span>
      ),
    },
    {
      header: "Visibility",
      accessorKey: "hidden" as keyof Movie,
      cell: (row: Movie) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            row.hidden
              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500"
              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
          }`}
        >
          {row.hidden ? "Hidden" : "Visible"}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Movies</h1>
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
          data={movies}
          columns={columns}
          onAdd={handleAddMovie}
          onEdit={handleEditMovie}
          onDelete={handleDeleteMovie}
          searchPlaceholder="Search movies..."
        />
      )}

      {/* Add Movie Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Movie" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Title" id="title" required>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                required
              />
            </FormField>

            <FormField label="Year" id="year" required>
              <input
                type="text"
                id="year"
                name="year"
                value={formData.year || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                required
              />
            </FormField>
          </div>

          <FormField label="Description" id="description" required>
            <textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-input bg-background resize-none"
              required
            />
          </FormField>

          <FormField label="Genres" id="genre" required>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {ALL_GENRES.map((genre) => (
                <label key={genre} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={(formData.genre || []).includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                    className="rounded border-input"
                  />
                  {genre}
                </label>
              ))}
            </div>
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Rating" id="rating">
              <input
                type="text"
                id="rating"
                name="rating"
                value={formData.rating || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              />
            </FormField>

            <FormField label="Duration" id="duration">
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration || ""}
                onChange={handleInputChange}
                placeholder="e.g. 120 min"
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Image URL" id="image">
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              />
            </FormField>

            <FormField label="Trailer URL" id="trailer">
              <input
                type="text"
                id="trailer"
                name="trailer"
                value={formData.trailer || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Release Date" id="releaseDate">
              <input
                type="text"
                id="releaseDate"
                name="releaseDate"
                value={formData.releaseDate || ""}
                onChange={handleInputChange}
                placeholder="DD-MM-YYYY"
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              />
            </FormField>

            <FormField label="Director ID" id="directorId" required>
              <input
                type="text"
                id="directorId"
                name="directorId"
                value={formData.directorId || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                required
              />
            </FormField>
          </div>

          {/* Cast Members Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Cast Members</h3>
            
            {/* Add Cast Member Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Cast Member ID" id="castMemberId">
                <input
                  type="text"
                  id="castMemberId"
                  name="castMemberId"
                  value={newCastMember.castMemberId}
                  onChange={handleNewCastMemberChange}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  placeholder="Enter cast member ID"
                />
              </FormField>
              
              <FormField label="Character Name" id="character">
                <input
                  type="text"
                  id="character"
                  name="character"
                  value={newCastMember.character}
                  onChange={handleNewCastMemberChange}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  placeholder="Enter character name"
                />
              </FormField>
            </div>
            
            <button
              onClick={handleAddCastMember}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
            >
              Add Cast Member
            </button>
            
            {/* Cast Members List */}
            {castMembers.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Added Cast Members:</h4>
                <div className="space-y-2">
                  {castMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div>
                        <span className="font-medium">{member.castMemberId}</span>
                        {member.character && (
                          <span className="text-sm text-muted-foreground ml-2">as {member.character}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveCastMember(index)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Status" id="status" required>
              <select
                id="status"
                name="status"
                value={formData.status || "coming_soon"}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                required
              >
                <option value="coming_soon">Coming Soon</option>
                <option value="now_showing">Now Showing</option>
              </select>
            </FormField>

            <FormField label="Visibility" id="hidden">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hidden"
                  name="hidden"
                  checked={formData.hidden || false}
                  onChange={handleCheckboxChange}
                  className="rounded border-input"
                />
                <span>Hide this movie</span>
              </label>
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-md border border-input bg-background hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveMovie}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Save Movie
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Movie Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Movie" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Title" id="edit-title" required>
              <input
                type="text"
                id="edit-title"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                required
              />
            </FormField>

            <FormField label="Year" id="edit-year" required>
              <input
                type="text"
                id="edit-year"
                name="year"
                value={formData.year || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                required
              />
            </FormField>
          </div>

          <FormField label="Description" id="edit-description" required>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-input bg-background resize-none"
              required
            />
          </FormField>

          <FormField label="Genres" id="edit-genre" required>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {ALL_GENRES.map((genre) => (
                <label key={genre} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={(formData.genre || []).includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                    className="rounded border-input"
                  />
                  {genre}
                </label>
              ))}
            </div>
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Rating" id="edit-rating">
              <input
                type="text"
                id="edit-rating"
                name="rating"
                value={formData.rating || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              />
            </FormField>

            <FormField label="Duration" id="edit-duration">
              <input
                type="text"
                id="edit-duration"
                name="duration"
                value={formData.duration || ""}
                onChange={handleInputChange}
                placeholder="e.g. 120 min"
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Image URL" id="edit-image">
              <input
                type="text"
                id="edit-image"
                name="image"
                value={formData.image || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              />
            </FormField>

            <FormField label="Trailer URL" id="edit-trailer">
              <input
                type="text"
                id="edit-trailer"
                name="trailer"
                value={formData.trailer || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Release Date" id="edit-releaseDate">
              <input
                type="text"
                id="edit-releaseDate"
                name="releaseDate"
                value={formData.releaseDate || ""}
                onChange={handleInputChange}
                placeholder="DD-MM-YYYY"
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              />
            </FormField>

            <FormField label="Director ID" id="edit-directorId" required>
              <input
                type="text"
                id="edit-directorId"
                name="directorId"
                value={formData.directorId || ""}
                className="w-full px-3 py-2 rounded-md border border-input bg-background bg-muted"
                required
                disabled
                title="Director cannot be changed after creation"
              />
            </FormField>
          </div>

          {/* Cast Members Section - Read Only */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Cast Members</h3>
            <p className="text-sm text-muted-foreground">Cast members cannot be changed after creation</p>
            
            {/* Cast Members List - Read Only */}
            {castMembers.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Current Cast Members:</h4>
                <div className="space-y-2">
                  {castMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div>
                        <span className="font-medium">{member.castMemberId}</span>
                        {member.character && (
                          <span className="text-sm text-muted-foreground ml-2">as {member.character}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Status" id="edit-status" required>
              <select
                id="edit-status"
                name="status"
                value={formData.status || "coming_soon"}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                required
              >
                <option value="coming_soon">Coming Soon</option>
                <option value="now_showing">Now Showing</option>
              </select>
            </FormField>

            <FormField label="Visibility" id="edit-hidden">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-hidden"
                  name="hidden"
                  checked={formData.hidden || false}
                  onChange={handleCheckboxChange}
                  className="rounded border-input"
                />
                <span>Hide this movie</span>
              </label>
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
              onClick={handleSaveMovie}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Update Movie
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Movie"
        message={`Are you sure you want to delete "${currentMovie?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

