"use client"

import type React from "react"

import { useState } from "react"
import { Ticket } from "lucide-react"
import { Modal } from "@/components/modal"
import { FormField } from "@/components/form-field"
import type { Ticket as TicketType } from "@/types"

// Sample data
const sampleTickets: TicketType[] = [
  {
    id: "1",
    userId: "101",
    showtimeId: "201",
    seatId: "A1",
    price: 12.99,
    purchaseDate: "2024-04-05",
    status: "reserved",
  },
  {
    id: "2",
    userId: "102",
    showtimeId: "202",
    seatId: "B3",
    price: 12.99,
    purchaseDate: "2024-04-05",
    status: "paid",
  },
  {
    id: "3",
    userId: "103",
    showtimeId: "203",
    seatId: "C5",
    price: 15.99,
    purchaseDate: "2024-04-06",
    status: "used",
  },
  {
    id: "4",
    userId: "104",
    showtimeId: "204",
    seatId: "D7",
    price: 12.99,
    purchaseDate: "2024-04-06",
    status: "deleted",
    deleteReason: "Customer requested refund",
  },
]

// Mock data for dropdowns
const mockMovies = [
  { id: "1", title: "Dune: Part Two" },
  { id: "2", title: "Oppenheimer" },
  { id: "3", title: "Gladiator II" },
]

const mockUsers = [
  { id: "101", name: "John Doe" },
  { id: "102", name: "Jane Smith" },
  { id: "103", name: "Robert Johnson" },
  { id: "104", name: "Emily Davis" },
]

const mockShowtimes = [
  { id: "201", movieId: "1", time: "18:00", date: "05-04-2024" },
  { id: "202", movieId: "1", time: "21:00", date: "05-04-2024" },
  { id: "203", movieId: "2", time: "19:30", date: "06-04-2024" },
  { id: "204", movieId: "3", time: "20:00", date: "06-04-2024" },
]

export default function StaffTicketsPage() {
  const [tickets, setTickets] = useState<TicketType[]>(sampleTickets)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [currentTicket, setCurrentTicket] = useState<TicketType | null>(null)
  const [formData, setFormData] = useState<Partial<TicketType>>({
    status: "reserved",
    deleteReason: "",
  })

  const handleUpdateTicket = (ticket: TicketType) => {
    setCurrentTicket(ticket)
    setFormData({
      status: ticket.status,
      deleteReason: ticket.deleteReason || "",
    })
    setIsUpdateModalOpen(true)
  }

  const handleSaveTicket = () => {
    if (isUpdateModalOpen && currentTicket) {
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === currentTicket.id
          ? {
              ...ticket,
              status: formData.status || ticket.status,
              deleteReason: formData.status === "deleted" ? formData.deleteReason : undefined,
            }
          : ticket,
      )
      setTickets(updatedTickets)
      setIsUpdateModalOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Helper function to get movie title from showtime
  const getMovieTitle = (showtimeId: string) => {
    const showtime = mockShowtimes.find((s) => s.id === showtimeId)
    if (!showtime) return "Unknown Movie"

    const movie = mockMovies.find((m) => m.id === showtime.movieId)
    return movie ? movie.title : "Unknown Movie"
  }

  // Helper function to get user name
  const getUserName = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId)
    return user ? user.name : "Unknown User"
  }

  // Helper function to get showtime details
  const getShowtimeDetails = (showtimeId: string) => {
    const showtime = mockShowtimes.find((s) => s.id === showtimeId)
    return showtime ? `${showtime.date} at ${showtime.time}` : "Unknown Time"
  }

  const filteredTickets = tickets.filter((ticket) => {
    const movieTitle = getMovieTitle(ticket.showtimeId)
    const userName = getUserName(ticket.userId)

    const matchesSearch =
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.seatId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ticket Management</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="search"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background"
          />
          <Ticket className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-input bg-background"
        >
          <option value="all">All Tickets</option>
          <option value="reserved">Reserved</option>
          <option value="paid">Paid</option>
          <option value="used">Used</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 text-left text-sm font-medium">Ticket ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Movie</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Showtime</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Seat</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => {
                  const statusClasses = {
                    reserved: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500",
                    paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
                    used: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
                    deleted: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
                  }

                  const statusLabels = {
                    reserved: "Reserved",
                    paid: "Paid",
                    used: "Used",
                    deleted: "Deleted",
                  }

                  return (
                    <tr key={ticket.id} className="border-t border-border">
                      <td className="px-4 py-3 text-sm">{ticket.id}</td>
                      <td className="px-4 py-3 text-sm">{getUserName(ticket.userId)}</td>
                      <td className="px-4 py-3 text-sm">{getMovieTitle(ticket.showtimeId)}</td>
                      <td className="px-4 py-3 text-sm">{getShowtimeDetails(ticket.showtimeId)}</td>
                      <td className="px-4 py-3 text-sm">{ticket.seatId}</td>
                      <td className="px-4 py-3 text-sm">${ticket.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[ticket.status]}`}>
                          {statusLabels[ticket.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button onClick={() => handleUpdateTicket(ticket)} className="text-primary hover:underline">
                          Update Status
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    No tickets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Ticket Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Ticket Status"
        size="md"
      >
        <div className="space-y-4">
          {currentTicket && (
            <div className="bg-muted p-4 rounded-md mb-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Movie:</p>
                  <p className="font-medium">{getMovieTitle(currentTicket.showtimeId)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Customer:</p>
                  <p className="font-medium">{getUserName(currentTicket.userId)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Showtime:</p>
                  <p className="font-medium">{getShowtimeDetails(currentTicket.showtimeId)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Seat:</p>
                  <p className="font-medium">{currentTicket.seatId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price:</p>
                  <p className="font-medium">${currentTicket.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Purchase Date:</p>
                  <p className="font-medium">{currentTicket.purchaseDate}</p>
                </div>
              </div>
            </div>
          )}

          <FormField label="Ticket Status" id="status" required>
            <select
              id="status"
              name="status"
              value={formData.status || "reserved"}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-md border border-input bg-background"
              required
            >
              <option value="reserved">Reserved</option>
              <option value="paid">Paid</option>
              <option value="used">Used</option>
              <option value="deleted">Deleted</option>
            </select>
          </FormField>

          {formData.status === "deleted" && (
            <FormField label="Reason for Deletion" id="deleteReason" required>
              <textarea
                id="deleteReason"
                name="deleteReason"
                value={formData.deleteReason || ""}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-input bg-background resize-none"
                required
              />
            </FormField>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsUpdateModalOpen(false)}
              className="px-4 py-2 rounded-md border border-input bg-background hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTicket}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Update Ticket
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

