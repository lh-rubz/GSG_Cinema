"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Ticket } from "lucide-react"
import { Modal } from "@/components/modal"
import { FormField } from "@/components/form-field"
import type { Ticket as TicketType } from "@/types/types"
import { ticketsApi } from "@/lib/endpoints/tickets"

// Define extended ticket type with nested objects
interface ExtendedTicket extends TicketType {
  user?: {
    id: string;
    username: string;
    displayName: string;
    email: string;
  };
  showtime?: {
    id: string;
    movieId: string;
    screenId: string;
    date: string;
    time: string;
    format: string;
    price: number;
    movie?: {
      id: string;
      title: string;
      year: string;
      genre: string[];
      rating: string;
      description: string;
      image: string;
      directorId: string;
      duration: string;
      releaseDate: string | null;
      trailer: string;
      status: string;
      hidden: boolean;
    };
    screen?: {
      id: string;
      name: string;
      type: string[];
      capacity: number;
      rows: number;
      cols: number;
      seatMap: any;
    };
  };
  seat?: {
    id: string;
    number: string;
    age: string | null;
    type: string;
    available: boolean;
    screenId: string;
    row: number;
    col: number;
  };
  receipt?: {
    id: string;
    userId: string;
    movieId: string;
    totalPrice: number;
    paymentMethod: string;
    receiptDate: string;
  };
  status: "reserved" | "paid" | "used" | "deleted";
}

export default function StaffTicketsPage() {
  const [tickets, setTickets] = useState<ExtendedTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [currentTicket, setCurrentTicket] = useState<ExtendedTicket | null>(null)
  const [formData, setFormData] = useState<Partial<TicketType>>({
    status: "reserved",
    deleteReason: "",
  })

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setIsLoading(true)
      const response = await ticketsApi.getTickets()
      
      if (response.error) {
        console.error(`Failed to fetch tickets: ${response.error}`)
        return
      }
      
      if (response.data) {
        setTickets(response.data as ExtendedTicket[])
      }
    } catch (error) {
      console.error("An error occurred while fetching tickets", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTicket = (ticket: ExtendedTicket) => {
    setCurrentTicket(ticket)
    setFormData({
      status: ticket.status,
      deleteReason: ticket.deleteReason || "",
    })
    setIsUpdateModalOpen(true)
  }

  const handleSaveTicket = async () => {
    if (isUpdateModalOpen && currentTicket) {
      try {
        const isChangingFromDeleted = currentTicket.status === "deleted" && formData.status !== "deleted";
        
        const updateData: any = {
          status: formData.status || currentTicket.status,
        };
        
        if (formData.status === "deleted") {
          updateData.deleteReason = formData.deleteReason || "Cancelled by staff";
        } else if (isChangingFromDeleted) {
          updateData.deleteReason = null;
        }
        
        console.log("Updating ticket with data:", updateData);
        
        const response = await ticketsApi.updateTicket(currentTicket.id, updateData);
        
        if (response.error) {
          console.error(`Failed to update ticket: ${response.error}`);
          return;
        }
        
        if (response.data) {
          const updatedTickets = tickets.map((ticket) =>
            ticket.id === currentTicket.id ? { 
              ...ticket, 
              ...response.data,
              deleteReason: isChangingFromDeleted ? undefined : (formData.status === "deleted" ? formData.deleteReason : ticket.deleteReason)
            } : ticket
          );
          setTickets(updatedTickets);
          setIsUpdateModalOpen(false);
        }
      } catch (error) {
        console.error("An error occurred while updating the ticket", error);
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const getMovieTitle = (ticket: ExtendedTicket) => {
    return ticket.showtime?.movie?.title || "Unknown Movie"
  }

  const getUserName = (ticket: ExtendedTicket) => {
    return ticket.user?.displayName || "Unknown User"
  }

  const getShowtimeDetails = (ticket: ExtendedTicket) => {
    if (!ticket.showtime) return "Unknown Time"
    return `${ticket.showtime.date} at ${ticket.showtime.time}`
  }

  const getScreenName = (ticket: ExtendedTicket) => {
    return ticket.showtime?.screen?.name || "Unknown Screen"
  }

  const filteredTickets = tickets.filter((ticket) => {
    const movieTitle = getMovieTitle(ticket)
    const userName = getUserName(ticket)
    const screenName = getScreenName(ticket)

    const matchesSearch =
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.seatId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      screenName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-900 dark:text-white">Loading tickets...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ticket Management</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="search"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <Ticket className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="all">All Tickets</option>
          <option value="reserved">Reserved</option>
          <option value="paid">Paid</option>
          <option value="used">Used</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Screen</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Movie</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Showtime</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Seat</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{getScreenName(ticket)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{getUserName(ticket)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{getMovieTitle(ticket)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{getShowtimeDetails(ticket)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{ticket.seatId}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">${ticket.showtime?.price || 0}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        ticket.status === "paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                          : ticket.status === "reserved"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
                          : ticket.status === "used"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500"
                      }`}
                    >
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleUpdateTicket(ticket)}
                      className="text-primary hover:underline"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No tickets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Ticket Status"
      >
        <div className="space-y-4">
          <FormField
            label="Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={handleInputChange}
            options={[
              { value: "reserved", label: "Reserved" },
              { value: "paid", label: "Paid" },
              { value: "used", label: "Used" },
              { value: "deleted", label: "Deleted" },
            ]}
          />
          {formData.status === "deleted" && (
            <FormField
              label="Delete Reason"
              name="deleteReason"
              type="textarea"
              value={formData.deleteReason}
              onChange={handleInputChange}
              placeholder="Enter reason for deletion..."
            />
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsUpdateModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTicket}
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

