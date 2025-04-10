"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { Modal } from "@/components/modal"
import { FormField } from "@/components/form-field"
import { ConfirmDialog } from "@/components/confirm-dialog"
import type { CastMember } from "@/types/types"
import { castMembersApi } from "@/lib/endpoints/cast-members"
import type { ApiResponse } from "@/lib/client"

export default function CastPage() {
  const [castMembers, setCastMembers] = useState<CastMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentCastMember, setCurrentCastMember] = useState<CastMember | null>(null)
  const [formData, setFormData] = useState<Partial<CastMember>>({
    name: "",
    character: "",
    image: "",
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchCastMembers()
  }, [])

  const fetchCastMembers = async () => {
    try {
      setIsLoading(true)
      const response = await castMembersApi.getCastMembers()
      if (response.data) {
        setCastMembers(response.data)
      }
    } catch (error) {
      console.error("Error fetching cast members:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCastMember = () => {
    setFormData({
      name: "",
      character: "",
      image: "",
    })
    setIsAddModalOpen(true)
  }

  const handleEditCastMember = (castMember: CastMember) => {
    setCurrentCastMember(castMember)
    setFormData({ ...castMember })
    setIsEditModalOpen(true)
  }

  const handleDeleteCastMember = (castMember: CastMember) => {
    setCurrentCastMember(castMember)
    setIsDeleteModalOpen(true)
  }

  const handleSaveCastMember = async () => {
    try {
      if (isAddModalOpen) {
        const response = await castMembersApi.createCastMember({
          id: `c${Date.now()}`, 
          name: formData.name || "",
          character: formData.character || "",
          image: formData.image || "",
        })
        if (response.data) {
          setCastMembers((prevCastMembers) => [...prevCastMembers, response.data as CastMember])
          setIsAddModalOpen(false)
        }
      } else if (isEditModalOpen && currentCastMember) {
        const response = await castMembersApi.updateCastMember(currentCastMember.id, {
          name: formData.name,
          character: formData.character,
          image: formData.image,
        })
        if (response.data) {
          setCastMembers((prevCastMembers) =>
            prevCastMembers.map((castMember) => (castMember.id === currentCastMember.id ? response.data as CastMember : castMember))
          )
          setIsEditModalOpen(false)
        }
      }
    } catch (error) {
      console.error("Error saving cast member:", error)
    }
  }

  const handleConfirmDelete = async () => {
    if (currentCastMember) {
      try {
        setErrorMessage(null)
        const response = await castMembersApi.deleteCastMember(currentCastMember.id)
        if (response.status === 200) {
          setCastMembers((prevCastMembers) => prevCastMembers.filter((castMember) => castMember.id !== currentCastMember.id))
          setIsDeleteModalOpen(false)
        } else if (response.error) {
          console.error("Error deleting cast member:", response.error)
          setErrorMessage(`Cannot delete ${currentCastMember.name}: ${response.error}`)
        }
      } catch (error: any) {
        console.error("Error deleting cast member:", error)
        
        console.log("Full error object:", JSON.stringify(error, null, 2))
        
        if (error instanceof Error) {
          setErrorMessage(`Error: ${error.message || "Unknown error occurred"}`)
        } else {
          setErrorMessage("An unexpected error occurred while deleting the cast member.")
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
      header: "Cast Member",
      accessorKey: "name" as keyof CastMember,
      cell: (row: CastMember) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
              <img src={row.image || "/placeholder.svg"} alt={row.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
              {row.name.charAt(0)}
            </div>
          )}
          <div className="font-medium">{row.name}</div>
        </div>
      ),
    },
    {
      header: "Character",
      accessorKey: "character" as keyof CastMember,
    },
    {
      header: "Movies",
      accessorKey: (row: CastMember) => row.movies?.length?.toString() || "0",
      cell: (row: CastMember) => <div>{row.movies?.length || 0} movies</div>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cast Members</h1>
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
          data={castMembers}
          columns={columns}
          onAdd={handleAddCastMember}
          onEdit={handleEditCastMember}
          onDelete={handleDeleteCastMember}
          searchPlaceholder="Search cast members..."
        />
      )}

      {/* Add Cast Member Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Cast Member" size="md">
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

          <FormField label="Character" id="character" required>
            <input
              type="text"
              id="character"
              name="character"
              value={formData.character || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-md border border-input bg-background"
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
              onClick={handleSaveCastMember}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Add Cast Member
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Cast Member Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Cast Member" size="md">
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

          <FormField label="Character" id="edit-character" required>
            <input
              type="text"
              id="edit-character"
              name="character"
              value={formData.character || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-md border border-input bg-background"
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
              onClick={handleSaveCastMember}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Update Cast Member
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Cast Member"
        message={`Are you sure you want to delete ${currentCastMember?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

