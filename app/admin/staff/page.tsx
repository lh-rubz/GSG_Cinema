"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { Modal } from "@/components/modal"
import { FormField } from "@/components/form-field"
import { ConfirmDialog } from "@/components/confirm-dialog"
import type { User as UserType } from "@/types/types"
import { usersApi } from "@/lib/endpoints/users"
import { apiClient } from "@/lib/client"
import toast from "react-hot-toast"
import { generatePassword } from "@/lib/utils"

export default function StaffPage() {
  const [staff, setStaff] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
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
    role: "Staff",
    movieIdsPurchased: [],
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [mode, setMode] = useState<"add" | "edit">("add")

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      setIsLoading(true)
      const response = await usersApi.getUsers()
      if (response.data) {
        const filteredStaff = response.data.filter(user => user.role === "Staff")
        setStaff(filteredStaff)
      }
    } catch (error) {
      console.error("Error fetching staff:", error)
      setErrorMessage("Failed to fetch staff. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddStaff = async () => {
    try {
      // Add staff logic (e.g., saving to the database)
      const newStaff = {
        username: formData.username,
        displayName: formData.displayName,
        email: formData.email,
        tempPassword: formData.password,
        role: "Staff", // Example role
      };

      // Call the API to send the email
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "newStaff",
          recipient: newStaff.email,
          subject: "Welcome to CinemaHub Staff",
          textContent: `Welcome ${newStaff.displayName}! Your temporary password is: ${newStaff.tempPassword}`,
          staffName: newStaff.displayName,
          email: newStaff.email,
          tempPassword: newStaff.tempPassword,
          role: newStaff.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email");
      }

      // Show success message
      console.log("Email sent successfully:", result);
    } catch (error) {
      console.error("Error adding staff or sending email:", error);
    }
  };

  const handleEditStaff = (staffMember: UserType) => {
    setCurrentStaff(staffMember)
    const { password, ...staffWithoutPassword } = staffMember
    setFormData({ 
      ...staffWithoutPassword,
      password: "" // Clear password field for security
    })
    setFormErrors({})
    setErrorMessage(null)
    setMode("edit")
    setIsModalOpen(true)
  }

  const handleDeleteStaff = (staffMember: UserType) => {
    setCurrentStaff(staffMember)
    setIsDeleteModalOpen(true)
  }

  const sendStaffWelcomeEmail = async (email: string, staffName: string, password: string) => {
    // TODO: Implement email service
    console.log(`Welcome email would be sent to ${email} for ${staffName} with password ${password}`);
  };

  const sendStaffRemovalEmail = async (email: string, staffName: string) => {
    try {
      const response = await apiClient.post('/api/sendemail', {
        type: 'deleteStaff',
        recipient: email,
        subject: 'CinemaHub Staff Access Removed',
        staffName: staffName,
        effectiveDate: new Date().toLocaleDateString(),
        textContent: `Your staff access to CinemaHub has been removed.`
      })

      if (response.error) {
        console.error("Failed to send removal email:", response.error)
      }
    } catch (error) {
      console.error("Error sending removal email:", error)
    }
  }

  const handleSaveStaff = async () => {
    try {
      setErrorMessage(null);
      setFormErrors({});

      // Validate required fields
      const errors: Record<string, string> = {};
      if (!formData.username) errors.username = "Username is required";
      if (!formData.displayName) errors.displayName = "Display name is required";
      if (!formData.email) errors.email = "Email is required";
      if (mode === "add" && !formData.password) errors.password = "Password is required";

      if (Object.keys(errors).length > 0) {
        Object.values(errors).forEach((error) => toast.error(error)); // Display errors in toast
        return;
      }

      if (mode === "add") {
        const newStaffId = `u${Date.now()}`;

        const userData = {
          id: newStaffId,
          username: formData.username || "",
          displayName: formData.displayName || "",
          email: formData.email || "",
          password: formData.password || "",
          gender: formData.gender || "M",
          bio: formData.bio || "",
          profileImage: formData.profileImage || "",
          role: "Staff" as const,
        };

        const response = await usersApi.createUser(userData);

        if (response.error) {
          console.error("Error creating staff member:", response.error);

          const errorMessage = response.error.toLowerCase();

          if (errorMessage.includes("username") || errorMessage.includes("email")) {
            if (errorMessage.includes("username")) {
              toast.error("Username already exists");
            }
            if (errorMessage.includes("email")) {
              toast.error("Email already exists");
            }
            toast.error("Username or email already exists. Please check the highlighted fields.");
          } else {
            toast.error(response.error);
          }
          return;
        }

        if (response.data) {
          const mappedStaff = {
            ...response.data,
            role: "Staff",
          } as UserType;

          setStaff((prevStaff) => [...prevStaff, mappedStaff]);
          setIsModalOpen(false);
          toast.success("Staff member added successfully!");

          // Send welcome email with credentials
          await fetch("/api/sendEmail", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "staffWelcome",
              recipient: formData.email || "",
              name: formData.displayName || "",
              tempPassword: formData.password || "",
              role: "Staff",
              email: formData.email || "",
            }),
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error("Failed to send email");
              }
              toast.success("Welcome email sent successfully!");
            })
            .catch((error) => {
              console.error("Error sending email:", error);
              toast.error("Failed to send welcome email.");
            });
        }
      } else if (mode === "edit" && currentStaff) {
        const updateData: Partial<UserType> = {
          username: formData.username,
          displayName: formData.displayName,
          email: formData.email,
          gender: formData.gender,
          bio: formData.bio,
          profileImage: formData.profileImage,
        };

        // Only include password if it was changed
        if (formData.password && formData.password.trim() !== "") {
          updateData.password = formData.password;
        }

        const response = await usersApi.updateUser(currentStaff.id, updateData);

        if (response.error) {
          console.error("Error updating staff member:", response.error);

          const errorMessage = response.error.toLowerCase();

          if (errorMessage.includes("username") || errorMessage.includes("email")) {
            if (errorMessage.includes("username")) {
              toast.error("Username already exists");
            }
            if (errorMessage.includes("email")) {
              toast.error("Email already exists");
            }
            toast.error("Username or email already exists. Please check the highlighted fields.");
          } else {
            toast.error(response.error);
          }
          return;
        }

        if (response.data) {
          const mappedStaff = {
            ...response.data,
            role: "Staff",
          } as UserType;

          setStaff((prevStaff) =>
            prevStaff.map((staffMember) => (staffMember.id === currentStaff.id ? mappedStaff : staffMember))
          );
          setIsModalOpen(false);
          toast.success("Staff member updated successfully!");
        }
      }
    } catch (error) {
      console.error("Error saving staff member:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleConfirmDelete = async () => {
    if (currentStaff) {
      try {
        // Send removal email before deleting
        await sendStaffRemovalEmail(currentStaff.email, currentStaff.displayName)
        
        const response = await usersApi.deleteUser(currentStaff.id)
        
        if (response.error) {
          console.error("Error deleting staff member:", response.error)
          setErrorMessage(response.error)
          return
        }
        
        setStaff((prevStaff) => prevStaff.filter((staffMember) => staffMember.id !== currentStaff.id))
        setIsDeleteModalOpen(false)
        toast.success("Staff member deleted successfully!")
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
          onAdd={() => {
            setMode("add"); // Set mode to "add"
            setFormData({
              username: "",
              displayName: "",
              email: "",
              password: generatePassword(12), // Generate a default password
              gender: "M",
              bio: "",
              profileImage: "",
              role: "Staff",
            }); // Reset form data
            setFormErrors({});
            setErrorMessage(null);
            setIsModalOpen(true); // Open the modal
          }}
          onEdit={handleEditStaff}
          onDelete={handleDeleteStaff}
          searchPlaceholder="Search staff members..."
        />
      )}

      {/* Combined Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={mode === "add" ? "Add New Staff Member" : "Edit Staff Member"} 
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Username" id="username" required error={formErrors.username}>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-zinc-200 dark:bg-zinc-600 text-zinc-300  dark:text-white"
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
                className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 dark:bg-zinc-600 text-zinc-300 dark:bg-dark-background dark:text-dark-foreground"
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
                className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 dark:bg-zinc-600 text-zinc-300 dark:bg-dark-background dark:text-dark-foreground"
                required
              />
            </FormField>

            {mode === "add" ? (
              <FormField 
                label="Password (auto-generated)" 
                id="password" 
                required 
                error={formErrors.password}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    id="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 dark:bg-zinc-600 text-zinc-300 dark:bg-dark-background dark:text-dark-foreground"
                    required
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, password: generatePassword(12)})}
                    className="px-3 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    Regenerate
                  </button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  This password will be emailed to the staff member
                </p>
              </FormField>
            ) : (
              <FormField 
                label="New Password (leave blank to keep current)" 
                id="password"
              >
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 dark:bg-zinc-600"
                  placeholder="••••••••"
                />
              </FormField>
            )}
          </div>

          <FormField label="Bio" id="bio">
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 dark:bg-zinc-600 resize-none"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Gender" id="gender">
              <select
                id="gender"
                name="gender"
                value={formData.gender || "M"}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 dark:bg-zinc-600"
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
                className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 dark:bg-zinc-600"
                placeholder="https://example.com/image.jpg"
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-md border border-input  bg-zinc-200 dark:bg-zinc-600 hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveStaff}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {mode === "add" ? "Add Staff Member" : "Update Staff Member"}
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