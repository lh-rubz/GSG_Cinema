"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { Modal } from "@/components/modal"
import { FormField } from "@/components/form-field"
import { ConfirmDialog } from "@/components/confirm-dialog"
import type { User as UserType } from "@/types/types"
import { usersApi } from "@/lib/endpoints/users"
import type { ApiResponse } from "@/lib/client"

export default function StaffPage() {
  const [staff, setStaff] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentStaff, setCurrentStaff] = useState<UserType | null>(null)
  const [formData, setFormData] = useState<Partial<UserType>>({
    username: "",
    displayName: "",
    email: "",
    password: "",
    gender: "M",
    bio: "",
    profileImage: "",
    role: "staff", 
    movieIdsPurchased: [],
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      setIsLoading(true)
      const response = await usersApi.getUsers()
      if (response.data) {

        const mappedUsers = response.data.map(user => {
          const apiRole = user.role as string;
          let frontendRole: "admin" | "staff" | "customer";
          
          if (apiRole === "User") {
            frontendRole = "customer";
          } else if (apiRole === "Admin") {
            frontendRole = "admin";
          } else if (apiRole === "Staff") {
            frontendRole = "staff";
          } else {
            frontendRole = "customer";
          }
          
          return {
            ...user,
            role: frontendRole
          };
        });
        
        const filteredStaff = mappedUsers.filter(user => user.role === "staff")
        setStaff(filteredStaff)
      }
    } catch (error) {
      console.error("Error fetching staff:", error)
      setErrorMessage("Failed to fetch staff. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddStaff = () => {
    setFormData({
      username: "",
      displayName: "",
      email: "",
      password: "",
      gender: "M",
      bio: "",
      profileImage: "",
      role: "staff", 
      movieIdsPurchased: [],
    })
    setFormErrors({})
    setErrorMessage(null)
    setIsAddModalOpen(true)
  }

  const handleEditStaff = (staffMember: UserType) => {
    setCurrentStaff(staffMember)
    const { password, ...staffWithoutPassword } = staffMember
    setFormData({ 
      ...staffWithoutPassword,
      password: "" 
    })
    setFormErrors({})
    setErrorMessage(null)
    setIsEditModalOpen(true)
  }

  const handleDeleteStaff = (staffMember: UserType) => {
    setCurrentStaff(staffMember)
    setIsDeleteModalOpen(true)
  }

  const handleSaveStaff = async () => {
    try {
      setErrorMessage(null)
      setFormErrors({})

      if (!formData.username || !formData.displayName || !formData.email || (isAddModalOpen && !formData.password)) {
        const errors: Record<string, string> = {}
        if (!formData.username) errors.username = "Username is required"
        if (!formData.displayName) errors.displayName = "Display name is required"
        if (!formData.email) errors.email = "Email is required"
        if (isAddModalOpen && !formData.password) errors.password = "Password is required"
        
        setFormErrors(errors)
        setErrorMessage("Please fill in all required fields")
        return
      }

      if (isAddModalOpen) {
        const newStaffId = `u${Date.now()}`
        
        const userData = {
          id: newStaffId,
          username: formData.username || "",
          displayName: formData.displayName || "",
          email: formData.email || "",
          password: formData.password || "",
          gender: formData.gender || "M",
          bio: formData.bio || "",
          profileImage: formData.profileImage || "",
          role: "Staff" 
        }
        
        const response = await usersApi.createUser(userData)
        
        if (response.error) {
          console.error("Error creating staff member:", response.error)
          
          const errorMessage = response.error.toLowerCase()
          
          if (errorMessage.includes("username") || errorMessage.includes("email")) {
            if (errorMessage.includes("username")) {
              setFormErrors({ ...formErrors, username: "Username already exists" })
            }
            if (errorMessage.includes("email")) {
              setFormErrors({ ...formErrors, email: "Email already exists" })
            }
            setErrorMessage("Username or email already exists. Please check the highlighted fields.")
          } else {
            setErrorMessage(response.error)
          }
          return
        }
        
        if (response.data) {
          const mappedStaff = {
            ...response.data,
            role: "staff"
          } as UserType
          
          setStaff((prevStaff) => [...prevStaff, mappedStaff])
          setIsAddModalOpen(false)
        }
      } else if (isEditModalOpen && currentStaff) {
        const updateData: Partial<UserType> = {
          username: formData.username,
          displayName: formData.displayName,
          email: formData.email,
          gender: formData.gender,
          bio: formData.bio,
          profileImage: formData.profileImage,
        }
        
        if (formData.password && formData.password.trim() !== "") {
          updateData.password = formData.password
        }
        
        const response = await usersApi.updateUser(currentStaff.id, updateData)
        
        if (response.error) {
          console.error("Error updating staff member:", response.error)
          
          const errorMessage = response.error.toLowerCase()
          
          if (errorMessage.includes("username") || errorMessage.includes("email")) {
            if (errorMessage.includes("username")) {
              setFormErrors({ ...formErrors, username: "Username already exists" })
            }
            if (errorMessage.includes("email")) {
              setFormErrors({ ...formErrors, email: "Email already exists" })
            }
            setErrorMessage("Username or email already exists. Please check the highlighted fields.")
          } else {
            setErrorMessage(response.error)
          }
          return
        }
        
        if (response.data) {
          const mappedStaff = {
            ...response.data,
            role: "staff" 
          } as UserType
          
          setStaff((prevStaff) =>
            prevStaff.map((staffMember) => (staffMember.id === currentStaff.id ? mappedStaff : staffMember))
          )
          setIsEditModalOpen(false)
        }
      }
    } catch (error) {
      console.error("Error saving staff member:", error)
      setErrorMessage("An unexpected error occurred. Please try again.")
    }
  }

  const handleConfirmDelete = async () => {
    if (currentStaff) {
      try {
        const response = await usersApi.deleteUser(currentStaff.id)
        
        if (response.error) {
          console.error("Error deleting staff member:", response.error)
          setErrorMessage(response.error)
          return
        }
        
        setStaff((prevStaff) => prevStaff.filter((staffMember) => staffMember.id !== currentStaff.id))
        setIsDeleteModalOpen(false)
      } catch (error) {
        console.error("Error deleting staff member:", error)
        setErrorMessage("An unexpected error occurred while deleting the staff member.")
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }
  }

  const columns = [
    {
      header: "Staff Member",
      accessorKey: "displayName" as keyof UserType,
      cell: (row: UserType) => (
        <div className="flex items-center gap-3">
          {row.profileImage ? (
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
              <img
                src={row.profileImage || "/placeholder.svg"}
                alt={row.displayName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
              {row.displayName.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-medium">{row.displayName}</div>
            <div className="text-xs text-muted-foreground">{row.username}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      accessorKey: "email" as keyof UserType,
    },
    {
      header: "Gender",
      accessorKey: "gender" as keyof UserType,
      cell: (row: UserType) => (row.gender === "M" ? "Male" : "Female"),
    },
    {
      header: "Bio",
      accessorKey: "bio" as keyof UserType,
      cell: (row: UserType) => row.bio || "-",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staff Members</h1>
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
          data={staff}
          columns={columns}
          onAdd={handleAddStaff}
          onEdit={handleEditStaff}
          onDelete={handleDeleteStaff}
          searchPlaceholder="Search staff members..."
        />
      )}

      {/* Add Staff Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Staff Member" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Username" id="username" required error={formErrors.username}>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                required
              />
            </FormField>

            <FormField label="Display Name" id="displayName" required error={formErrors.displayName}>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Email" id="email" required error={formErrors.email}>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                required
              />
            </FormField>

            <FormField label="Password" id="password" required error={formErrors.password}>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                required
              />
            </FormField>
          </div>

          <FormField label="Bio" id="bio">
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-input bg-background resize-none"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Gender" id="gender">
              <select
                id="gender"
                name="gender"
                value={formData.gender || "M"}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </FormField>

            <FormField label="Profile Image URL" id="profileImage">
              <input
                type="text"
                id="profileImage"
                name="profileImage"
                value={formData.profileImage || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                placeholder="https://example.com/image.jpg"
              />
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
              onClick={handleSaveStaff}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Save Staff Member
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Staff Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Staff Member" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Username" id="edit-username" required error={formErrors.username}>
              <input
                type="text"
                id="edit-username"
                name="username"
                value={formData.username || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                required
              />
            </FormField>

            <FormField label="Display Name" id="edit-displayName" required error={formErrors.displayName}>
              <input
                type="text"
                id="edit-displayName"
                name="displayName"
                value={formData.displayName || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Email" id="edit-email" required error={formErrors.email}>
              <input
                type="email"
                id="edit-email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                required
              />
            </FormField>

            {/* Password field is hidden in edit mode */}
          </div>

          <FormField label="Bio" id="edit-bio">
            <textarea
              id="edit-bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-input bg-background resize-none"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Gender" id="edit-gender">
              <select
                id="edit-gender"
                name="gender"
                value={formData.gender || "M"}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </FormField>

            <FormField label="Profile Image URL" id="edit-profileImage">
              <input
                type="text"
                id="edit-profileImage"
                name="profileImage"
                value={formData.profileImage || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                placeholder="https://example.com/image.jpg"
              />
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
              onClick={handleSaveStaff}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Update Staff Member
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Staff Member"
        message={`Are you sure you want to delete "${currentStaff?.displayName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

