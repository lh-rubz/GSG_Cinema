"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { Modal } from "@/components/modal"
import { FormField } from "@/components/form-field"
import { ConfirmDialog } from "@/components/confirm-dialog"
import type { Director } from "@/types/types"
import { directorsApi } from "@/lib/endpoints/directors"
import { toast } from "react-hot-toast" 

export default function DirectorsPage() {
  const [directors, setDirectors] = useState<Director[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentDirector, setCurrentDirector] = useState<Director | null>(null)
  const [formData, setFormData] = useState<Partial<Director>>({
    name: "",
    bio: "",
    image: "",
  })

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
      toast.error("Error fetching directors.")
      console.error("Error fetching directors:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (director?: Director) => {
    if (director) {
      setCurrentDirector(director)
      setFormData({ ...director })
    } else {
      setCurrentDirector(null)
      setFormData({
        name: "",
        bio: "",
        image: "",
      })
    }
    setIsModalOpen(true)
  }

  const handleDeleteDirector = (director: Director) => {
    setCurrentDirector(director)
    setIsDeleteModalOpen(true)
  }

  const handleSaveDirector = async () => {
    try {
      if (currentDirector) {
        // Edit existing director
        const response = await directorsApi.updateDirector(currentDirector.id, {
          name: formData.name,
          bio: formData.bio,
          image: formData.image,
        })
        if (response.data) {
          setDirectors((prevDirectors) =>
            prevDirectors.map((director) => (director.id === currentDirector.id ? response.data as Director : director))
          )
          toast.success("Director updated successfully!")
        }
      } else {
        // Add new director
        const response = await directorsApi.createDirector({
          id: `d${Date.now()}`, // Generate a unique ID
          name: formData.name || "",
          bio: formData.bio || "",
          image: formData.image || "",
        })
        if (response.data) {
          setDirectors((prevDirectors) => [...prevDirectors, response.data as Director])
          toast.success("Director added successfully!")
        }
      }
      setIsModalOpen(false)
    } catch (error) {
      toast.error("Error saving director.")
      console.error("Error saving director:", error)
    }
  }

  const handleConfirmDelete = async () => {
    if (currentDirector) {
      try {
        const response = await directorsApi.deleteDirector(currentDirector.id)
        if (response.status === 200) {
          setDirectors((prevDirectors) => prevDirectors.filter((director) => director.id !== currentDirector.id))
          toast.success("Director deleted successfully!")
          setIsDeleteModalOpen(false)
        } else if (response.error) {
          toast.error(`Cannot delete ${currentDirector.name}: ${response.error}`)
          console.error("Error deleting director:", response.error)
        }
      } catch (error: any) {
        toast.error("An unexpected error occurred while deleting the director.")
        console.error("Error deleting director:", error)
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

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable
          data={directors}
          columns={columns}
          onAdd={() => handleOpenModal()}
          onEdit={handleOpenModal}
          onDelete={handleDeleteDirector}
          searchPlaceholder="Search directors..."
        />
      )}

      {/* Add/Edit Director Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentDirector ? "Edit Director" : "Add New Director"} size="md">
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
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-md border border-input bg-background hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDirector}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {currentDirector ? "Update Director" : "Add Director"}
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

