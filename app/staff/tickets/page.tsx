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
        <div className="text-lg">Loading tickets...</div>
      </div>
    )
  }

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
                <th className="px-4 py-3 text-left text-sm font-medium">Screen</th>
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
                      <td className="px-4 py-3 text-sm">{getScreenName(ticket)}</td>
                      <td className="px-4 py-3 text-sm">{getUserName(ticket)}</td>
                      <td className="px-4 py-3 text-sm">{getMovieTitle(ticket)}</td>
                      <td className="px-4 py-3 text-sm">{getShowtimeDetails(ticket)}</td>
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
                  <p className="font-medium">{getMovieTitle(currentTicket)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Customer:</p>
                  <p className="font-medium">{getUserName(currentTicket)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Showtime:</p>
                  <p className="font-medium">{getShowtimeDetails(currentTicket)}</p>
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

