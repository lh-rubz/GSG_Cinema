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

export default function CustomersPage() {
  const [customers, setCustomers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState<UserType | null>(null)
  const [formData, setFormData] = useState<Partial<UserType>>({
    username: "",
    displayName: "",
    email: "",
    password: "",
    gender: "M",
    bio: "",
    profileImage: "",
    role: "User",
    movieIdsPurchased: [],
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      const response = await usersApi.getUsers()
      if (response.data) {
        const filteredUsers = response.data.filter(user => user.role === "User")
        setCustomers(filteredUsers)
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
      setErrorMessage("Failed to fetch customers. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCustomer = () => {
    setFormData({
      username: "",
      displayName: "",
      email: "",
      password: "",
      gender: "M",
      bio: "",
      profileImage: "",
      role: "User",
      movieIdsPurchased: [],
    })
    setFormErrors({})
    setErrorMessage(null)
    setIsAddModalOpen(true)
  }

  const handleEditCustomer = (customer: UserType) => {
    setCurrentCustomer(customer)

    const { password, ...customerWithoutPassword } = customer
    setFormData({ 
      ...customerWithoutPassword,
      password: "" 
    })
    setFormErrors({})
    setErrorMessage(null)
    setIsEditModalOpen(true)
  }

  const handleDeleteCustomer = (customer: UserType) => {
    setCurrentCustomer(customer)
    setIsDeleteModalOpen(true)
  }

  const handleSaveCustomer = async () => {
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
        const newCustomerId = `u${Date.now()}`
        
        const response = await usersApi.createUser({
          id: newCustomerId,
          username: formData.username || "",
          displayName: formData.displayName || "",
          email: formData.email || "",
          password: formData.password || "",
          gender: formData.gender || "M",
          bio: formData.bio || "",
          profileImage: formData.profileImage || "",
          role: "User",
        })
        
        if (response.error) {
          console.error("Error creating customer:", response.error)
          
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
          setCustomers((prevCustomers) => [...prevCustomers, response.data as UserType])
          setIsAddModalOpen(false)
        }
      } else if (isEditModalOpen && currentCustomer) {
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
        
        const response = await usersApi.updateUser(currentCustomer.id, updateData)
        
        if (response.error) {
          console.error("Error updating customer:", response.error)
          
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
          setCustomers((prevCustomers) =>
            prevCustomers.map((customer) => (customer.id === currentCustomer.id ? response.data as UserType : customer))
          )
          setIsEditModalOpen(false)
        }
      }
    } catch (error) {
      console.error("Error saving customer:", error)
      setErrorMessage("An unexpected error occurred. Please try again.")
    }
  }

  const handleConfirmDelete = async () => {
    if (currentCustomer) {
      try {
        const response = await usersApi.deleteUser(currentCustomer.id)
        
        if (response.error) {
          console.error("Error deleting customer:", response.error)
          setErrorMessage(response.error)
          return
        }
        
        setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.id !== currentCustomer.id))
        setIsDeleteModalOpen(false)
      } catch (error) {
        console.error("Error deleting customer:", error)
        setErrorMessage("An unexpected error occurred while deleting the customer.")
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
      header: "Customer",
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
        <h1 className="text-2xl font-bold">Customers</h1>
      </div>

      {errorMessage && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md flex items-center justify-between">
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage(null)} className="text-destructive hover:text-destructive/80">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable
          data={customers}
          columns={columns}
          onAdd={handleAddCustomer}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
          searchPlaceholder="Search customers..."
        />
      )}

      {/* Add Customer Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Customer" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Username" id="username" required error={formErrors.username}>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white!"
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
                className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white!"
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
                className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white!"
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
                className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white!"
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
              className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white! resize-none"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Gender" id="gender">
              <select
                id="gender"
                name="gender"
                value={formData.gender || "M"}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white!"
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
                className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white!"
                placeholder="https://example.com/image.jpg"
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white! hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCustomer}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Save Customer
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Customer" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Username" id="edit-username" required error={formErrors.username}>
              <input
                type="text"
                id="edit-username"
                name="username"
                value={formData.username || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white!"
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
                className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white!"
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
                className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white!"
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
              className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white! resize-none"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Gender" id="edit-gender">
              <select
                id="edit-gender"
                name="gender"
                value={formData.gender || "M"}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white!"
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
                className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white!"
                placeholder="https://example.com/image.jpg"
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white! hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCustomer}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Update Customer
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${currentCustomer?.displayName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

