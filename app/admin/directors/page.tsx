"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { Modal } from "@/components/modal"
import { FormField } from "@/components/form-field"
import { ConfirmDialog } from "@/components/confirm-dialog"
import type { Director } from "@/types/types"
import { directorsApi } from "@/lib/endpoints/directors"
import type { ApiResponse } from "@/lib/client"

export default function DirectorsPage() {
  const [directors, setDirectors] = useState<Director[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentDirector, setCurrentDirector] = useState<Director | null>(null)
  const [formData, setFormData] = useState<Partial<Director>>({
    name: "",
    bio: "",
    image: "",
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchDirectors()
  }, [])

  const fetchDirectors = async () => {
    try {
      setIsLoading(true)
      const response = await directorsApi.getDirectors()
      if (response.data) {
        setDirectors(response.data)
      }
    } catch (error) {
      console.error("Error fetching directors:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddDirector = () => {
    setFormData({
      name: "",
      bio: "",
      image: "",
    })
    setIsAddModalOpen(true)
  }

  const handleEditDirector = (director: Director) => {
    setCurrentDirector(director)
    setFormData({ ...director })
    setIsEditModalOpen(true)
  }

  const handleDeleteDirector = (director: Director) => {
    setCurrentDirector(director)
    setIsDeleteModalOpen(true)
  }

  const handleSaveDirector = async () => {
    try {
      if (isAddModalOpen) {
        const response = await directorsApi.createDirector({
          id: `d${Date.now()}`, // Generate a unique ID
          name: formData.name || "",
          bio: formData.bio || "",
          image: formData.image || "",
        })
        if (response.data) {
          setDirectors((prevDirectors) => [...prevDirectors, response.data as Director])
          setIsAddModalOpen(false)
        }
      } else if (isEditModalOpen && currentDirector) {
        const response = await directorsApi.updateDirector(currentDirector.id, {
          name: formData.name,
          bio: formData.bio,
          image: formData.image,
        })
        if (response.data) {
          setDirectors((prevDirectors) =>
            prevDirectors.map((director) => (director.id === currentDirector.id ? response.data as Director : director))
          )
          setIsEditModalOpen(false)
        }
      }
    } catch (error) {
      console.error("Error saving director:", error)
    }
  }

  const handleConfirmDelete = async () => {
    if (currentDirector) {
      try {
        setErrorMessage(null)
        const response = await directorsApi.deleteDirector(currentDirector.id)
        if (response.status === 200) {
          setDirectors((prevDirectors) => prevDirectors.filter((director) => director.id !== currentDirector.id))
          setIsDeleteModalOpen(false)
        } else if (response.error) {
          // Handle error response from API
          console.error("Error deleting director:", response.error)
          setErrorMessage(`Cannot delete ${currentDirector.name}: ${response.error}`)
        }
      } catch (error: any) {
        console.error("Error deleting director:", error)
        
        // Log the full error object to see its structure
        console.log("Full error object:", JSON.stringify(error, null, 2))
        
        // Handle different error scenarios
        if (error instanceof Error) {
          setErrorMessage(`Error: ${error.message || "Unknown error occurred"}`)
        } else {
          setErrorMessage("An unexpected error occurred while deleting the director.")
        }
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof Director,
    },
    {
      header: "Bio",
      accessorKey: "bio" as keyof Director,
      cell: (row: Director) => (
        <div className="max-w-md truncate">{row.bio}</div>
      ),
    },
    {
      header: "Image",
      accessorKey: "image" as keyof Director,
      cell: (row: Director) => (
        <div className="w-10 h-10 rounded overflow-hidden bg-muted">
          {row.image ? (
            <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Directors</h1>
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
          data={directors}
          columns={columns}
          onAdd={handleAddDirector}
          onEdit={handleEditDirector}
          onDelete={handleDeleteDirector}
          searchPlaceholder="Search directors..."
        />
      )}

      {/* Add Director Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Director" size="md">
        <div className="space-y-4">
          <FormField label="Name" id="name" required>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-md border border-input bg-background"
              required
            />
          </FormField>

          <FormField label="Bio" id="bio" required>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 rounded-md border border-input bg-background resize-none"
              required
            />
          </FormField>

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

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-md border border-input bg-background hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDirector}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Add Director
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Director Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Director" size="md">
        <div className="space-y-4">
          <FormField label="Name" id="edit-name" required>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-md border border-input bg-background"
              required
            />
          </FormField>

          <FormField label="Bio" id="edit-bio" required>
            <textarea
              id="edit-bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 rounded-md border border-input bg-background resize-none"
              required
            />
          </FormField>

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

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-md border border-input bg-background hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDirector}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Update Director
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Director"
        message={`Are you sure you want to delete ${currentDirector?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

