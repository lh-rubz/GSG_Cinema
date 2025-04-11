"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Tag, Search, X, ChevronDown, ChevronUp, Edit, Trash2, Calendar } from "lucide-react"
import type { Promotion } from "@/types/types"
import type { ApiResponse } from "@/lib/client"
import { promotionsApi } from "@/lib/endpoints/promotions"

type PromotionFormData = {
  code: string
  description: string
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "BUY_ONE_GET_ONE"
  value: number
  startDate: string
  expiryDate: string
  isActive: boolean
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentPromotion, setCurrentPromotion] = useState<Promotion | null>(null)
  const [formData, setFormData] = useState<PromotionFormData>({
    code: "",
    description: "",
    type: "PERCENTAGE",
    value: 0,
    startDate: "",
    expiryDate: "",
    isActive: true
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Promotion>("code")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    try {
      setIsLoading(true)
      const response = await promotionsApi.getPromotions()
      if (response.data) {
        setPromotions(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch promotions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (field: keyof Promotion) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleAddPromotion = () => {
    setCurrentPromotion(null)
    setFormData({
      code: "",
      description: "",
      type: "PERCENTAGE",
      value: 0,
      startDate: "",
      expiryDate: "",
      isActive: true
    })
    setIsModalOpen(true)
  }

  const handleEditPromotion = (promotion: Promotion) => {
    setCurrentPromotion(promotion)
    setFormData({
      code: promotion.code,
      description: promotion.description,
      type: promotion.type,
      value: promotion.value,
      startDate: promotion.startDate,
      expiryDate: promotion.expiryDate,
      isActive: promotion.isActive
    })
    setIsModalOpen(true)
  }

  const handleDeletePromotion = (promotion: Promotion) => {
    setCurrentPromotion(promotion)
    setIsDeleteModalOpen(true)
  }

  const handleSavePromotion = async () => {
    try {
      if (currentPromotion) {
        await promotionsApi.updatePromotion(currentPromotion.id, formData)
      } else {
        await promotionsApi.createPromotion(formData)
      }
      setIsModalOpen(false)
      fetchPromotions()
    } catch (error) {
      console.error("Failed to save promotion:", error)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      if (currentPromotion) {
        await promotionsApi.deletePromotion(currentPromotion.id)
        setIsDeleteModalOpen(false)
        fetchPromotions()
      }
    } catch (error) {
      console.error("Failed to delete promotion:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === "value" ? parseFloat(value) : value
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const filteredPromotions = promotions.filter(promotion =>
    promotion.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promotion.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedPromotions = [...filteredPromotions].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (aValue === undefined) return 1
    if (bValue === undefined) return -1
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Promotions</h1>
        <button
          onClick={handleAddPromotion}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <Tag className="w-5 h-5" />
          Add Promotion
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search promotions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-zinc-700 dark:text-white"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-100 dark:bg-zinc-700">
              <th
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("code")}
              >
                <div className="flex items-center gap-1">
                  Code
                  {sortField === "code" && (
                    sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("description")}
              >
                <div className="flex items-center gap-1">
                  Description
                  {sortField === "description" && (
                    sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center gap-1">
                  Type
                  {sortField === "type" && (
                    sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("value")}
              >
                <div className="flex items-center gap-1">
                  Value
                  {sortField === "value" && (
                    sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("startDate")}
              >
                <div className="flex items-center gap-1">
                  Start Date
                  {sortField === "startDate" && (
                    sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("expiryDate")}
              >
                <div className="flex items-center gap-1">
                  Expiry Date
                  {sortField === "expiryDate" && (
                    sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("isActive")}
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortField === "isActive" && (
                    sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-zinc-500 dark:text-zinc-400">
                  Loading promotions...
                </td>
              </tr>
            ) : sortedPromotions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-zinc-500 dark:text-zinc-400">
                  No promotions found
                </td>
              </tr>
            ) : (
              sortedPromotions.map((promotion) => (
                <tr key={promotion.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-white">
                    {promotion.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white">
                    {promotion.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-white">
                    {promotion.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-white">
                    {promotion.type === "PERCENTAGE" ? `${promotion.value}%` : `$${promotion.value}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-white">
                    {new Date(promotion.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-white">
                    {new Date(promotion.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      promotion.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }`}>
                      {promotion.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditPromotion(promotion)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeletePromotion(promotion)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">
              {currentPromotion ? "Edit Promotion" : "Add Promotion"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-zinc-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-zinc-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-zinc-700 dark:text-white"
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED_AMOUNT">Fixed Amount</option>
                  <option value="BUY_ONE_GET_ONE">Buy One Get One</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Value
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-zinc-700 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-zinc-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="datetime-local"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-zinc-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-zinc-300 rounded"
                />
                <label className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300">
                  Active
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePromotion}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Delete Promotion</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Are you sure you want to delete the promotion "{currentPromotion?.code}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 