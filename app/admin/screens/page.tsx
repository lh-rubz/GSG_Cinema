"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { Modal } from "@/components/modal"
import { FormField } from "@/components/form-field"
import { ConfirmDialog } from "@/components/confirm-dialog"
import type { Screen, Seat } from "@/types/types"
import { screensApi } from "@/lib/endpoints/screens"
import type { ApiResponse } from "@/lib/client"

export default function ScreensPage() {
  const [screens, setScreens] = useState<Screen[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentScreen, setCurrentScreen] = useState<Screen | null>(null)
  const [formData, setFormData] = useState<Partial<Screen>>({
    name: "",
    type: [],
    capacity: 0,
    rows: 0,
    cols: 0,
  })
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const screenTypes = ["Standard", "Premium", "IMAX", "FourDX"]

  useEffect(() => {
    fetchScreens()
  }, [])

  const fetchScreens = async () => {
    try {
      setIsLoading(true)
      const response = await screensApi.getScreens({ includeSeatMap: true })
      if (response.data) {
        setScreens(response.data)
      }
    } catch (error) {
      console.error("Error fetching screens:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddScreen = () => {
    setFormData({
      name: "",
      type: [],
      capacity: 0,
      rows: 0,
      cols: 0,
    })
    setSelectedTypes([])
    setIsAddModalOpen(true)
  }

  const handleEditScreen = (screen: Screen) => {
    setCurrentScreen(screen)
    setFormData({ ...screen })
    setSelectedTypes([...screen.type])
    setIsEditModalOpen(true)
  }

  const handleDeleteScreen = (screen: Screen) => {
    setCurrentScreen(screen)
    setIsDeleteModalOpen(true)
  }

  const generateSeatMap = (screenId: string, rows: number, cols: number): Seat[][] => {
    const seatMap: Seat[][] = []
    const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    
    for (let row = 0; row < rows; row++) {
      const rowSeats: Seat[] = []
      for (let col = 0; col < cols; col++) {
        const seatNumber = `${rowLetters[row]}${col + 1}`
        const seatId = `${screenId}_${seatNumber}`
        
        const seatType = row === 0 ? "premium" : "standard"
        
        rowSeats.push({
          id: seatId,
          number: seatNumber,
          type: seatType,
          available: true,
          screenId: screenId,
          row: row,
          col: col,
          age: "adult" as const
        })
      }
      seatMap.push(rowSeats)
    }
    
    return seatMap
  }

  const handleSaveScreen = async () => {
    try {
      if (isAddModalOpen) {
        const screenId = `s${Date.now()}`
        const rows = Number(formData.rows)
        const cols = Number(formData.cols)
        const capacity = rows * cols
        const seatMap = generateSeatMap(screenId, rows, cols)
        
        console.log(`Creating screen with dimensions ${rows}×${cols}, capacity: ${capacity}`)
        console.log(`Seat map has ${seatMap.length} rows and ${seatMap[0]?.length || 0} columns`)
        
        const mappedTypes = selectedTypes.map(type => {
          if (type === "4DX") return "FourDX";
          return type;
        }) as ("Standard" | "Premium" | "IMAX" | "FourDX")[];
        
        const response = await screensApi.createScreen({
          id: screenId,
          name: formData.name || "",
          type: mappedTypes,
          capacity: capacity,
          rows: rows,
          cols: cols,
          seatMap: seatMap
        })
        
        if (response.data) {
          setScreens((prevScreens) => [...prevScreens, response.data as Screen])
          setIsAddModalOpen(false)
        }
      } else if (isEditModalOpen && currentScreen) {
        const mappedTypes = selectedTypes.map(type => {
          if (type === "4DX") return "FourDX";
          return type;
        }) as ("Standard" | "Premium" | "IMAX" | "FourDX")[];
        
        const response = await screensApi.updateScreen(currentScreen.id, {
          name: formData.name,
          type: mappedTypes,
        })
        
        if (response.data) {
          setScreens((prevScreens) =>
            prevScreens.map((screen) => (screen.id === currentScreen.id ? response.data as Screen : screen))
          )
          setIsEditModalOpen(false)
        }
      }
    } catch (error) {
      console.error("Error saving screen:", error)
      setErrorMessage("Failed to save screen. Please try again.")
    }
  }

  const handleConfirmDelete = async () => {
    if (currentScreen) {
      try {
        setErrorMessage(null)
        const response = await screensApi.deleteScreen(currentScreen.id)
        if (response.status === 200) {
          setScreens((prevScreens) => prevScreens.filter((screen) => screen.id !== currentScreen.id))
          setIsDeleteModalOpen(false)
        } else if (response.error) {
          console.error("Error deleting screen:", response.error)
          setErrorMessage(`Cannot delete ${currentScreen.name}: ${response.error}`)
        }
      } catch (error: any) {
        console.error("Error deleting screen:", error)
        
        console.log("Full error object:", JSON.stringify(error, null, 2))

        if (error instanceof Error) {
          setErrorMessage(`Error: ${error.message || "Unknown error occurred"}`)
        } else {
          setErrorMessage("An unexpected error occurred while deleting the screen.")
        }
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleTypeChange = (type: string) => {
    setSelectedTypes([type])
  }

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof Screen,
    },
    {
      header: "Type",
      accessorKey: "type" as keyof Screen,
      cell: (row: Screen) => row.type.join(", "),
    },
    {
      header: "Capacity",
      accessorKey: "capacity" as keyof Screen,
    },
    {
      header: "Dimensions",
      accessorKey: (row: Screen) => `${row.rows} × ${row.cols}`,
      cell: (row: Screen) => <div>{row.rows} × {row.cols}</div>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Screens</h1>
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
          data={screens}
          columns={columns}
          onAdd={handleAddScreen}
          onEdit={handleEditScreen}
          onDelete={handleDeleteScreen}
          searchPlaceholder="Search screens..."
        />
      )}

      {/* Add Screen Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Screen" size="md">
        <div className="space-y-4">
          <FormField label="Name" id="name" required>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white!"
              required
            />
          </FormField>

          <FormField label="Screen Types" id="type" required>
            <div className="grid grid-cols-2 gap-2">
              {screenTypes.map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="screenType"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                    className="rounded-full border-input"
                  />
                  {type}
                </label>
              ))}
            </div>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Rows" id="rows" required>
              <input
                type="number"
                id="rows"
                name="rows"
                value={formData.rows || ""}
                onChange={handleInputChange}
                min="1"
                max="26"
                className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white!"
                required
              />
            </FormField>

            <FormField label="Columns" id="cols" required>
              <input
                type="number"
                id="cols"
                name="cols"
                value={formData.cols || ""}
                onChange={handleInputChange}
                min="1"
                max="30"
                className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white!"
                required
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
              onClick={handleSaveScreen}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Add Screen
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Screen Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Screen" size="md">
        <div className="space-y-4">
          <FormField label="Name" id="edit-name" required>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white!"
              required
            />
          </FormField>

          <FormField label="Screen Types" id="edit-type" required>
            <div className="grid grid-cols-2 gap-2">
              {screenTypes.map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="screenType"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                    className="rounded-full border-input"
                  />
                  {type}
                </label>
              ))}
            </div>
          </FormField>

          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Screen dimensions (rows and columns) cannot be changed after creation.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Current dimensions: {currentScreen?.rows} rows × {currentScreen?.cols} columns
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-md border border-input  bg-zinc-200 text-black! dark:bg-zinc-700 dark:text-white! hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveScreen}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Update Screen
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Screen"
        message={`Are you sure you want to delete ${currentScreen?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

