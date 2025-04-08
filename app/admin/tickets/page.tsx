"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, Film, User } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Modal } from "@/components/modal"
import { FormField } from "@/components/form-field"
import { ConfirmDialog } from "@/components/confirm-dialog"
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
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<ExtendedTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
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

  const handleEditTicket = (ticket: ExtendedTicket) => {
    setCurrentTicket(ticket)
    setFormData({
      status: ticket.status,
      deleteReason: ticket.deleteReason || "",
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteTicket = (ticket: ExtendedTicket) => {
    setCurrentTicket(ticket)
    setIsDeleteModalOpen(true)
  }

  const handleSaveTicket = async () => {
    if (isEditModalOpen && currentTicket) {
      try {
        const isChangingFromDeleted = currentTicket.status === "deleted" && formData.status !== "deleted";
        
        const updateData: any = {
          status: formData.status || currentTicket.status,
        };
        

        if (formData.status === "deleted") {

          updateData.deleteReason = formData.deleteReason || "Cancelled by admin";
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
          setIsEditModalOpen(false);
        }
      } catch (error) {
        console.error("An error occurred while updating the ticket", error);
      }
    }
  }

  const handleConfirmDelete = async () => {
    if (currentTicket) {
      try {
        const reason = formData.deleteReason || "Cancelled by admin"
        console.log(`Attempting to delete ticket ${currentTicket.id} with reason: ${reason}`)
        
        const deleteResponse = await ticketsApi.deleteTicket(currentTicket.id, reason)
        console.log("Delete response:", deleteResponse)
        
        if (deleteResponse.error) {
          console.error(`Failed to delete ticket: ${deleteResponse.error}`)
          return
        }
        
        if (deleteResponse.data?.message === "Ticket deleted successfully") {
          const updatedTickets = tickets.filter((ticket) => ticket.id !== currentTicket.id)
          setTickets(updatedTickets)
        } else if (deleteResponse.data?.message === "Ticket marked as deleted") {
          const updatedTickets = tickets.map((ticket) =>
            ticket.id === currentTicket.id ? { ...ticket, status: "deleted" as const, deleteReason: reason } : ticket
          )
          setTickets(updatedTickets)
        }
        
        setIsDeleteModalOpen(false)
      } catch (error) {
        console.error("An error occurred while deleting the ticket", error)
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

  const columns = [
    {
      header: "Screen",
      accessorKey: (row: ExtendedTicket) => row.showtime?.screen?.name || "Unknown Screen",
      cell: (row: ExtendedTicket) => (
        <div className="flex items-center gap-2">
          <span>{row.showtime?.screen?.name || "Unknown Screen"}</span>
        </div>
      ),
    },
    {
      header: "Movie",
      accessorKey: (row: ExtendedTicket) => getMovieTitle(row),
      cell: (row: ExtendedTicket) => (
        <div className="flex items-center gap-2">
          <Film className="h-4 w-4 text-muted-foreground" />
          <span>{getMovieTitle(row)}</span>
        </div>
      ),
    },
    {
      header: "Customer",
      accessorKey: (row: ExtendedTicket) => getUserName(row),
      cell: (row: ExtendedTicket) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{getUserName(row)}</span>
        </div>
      ),
    },
    {
      header: "Showtime",
      accessorKey: (row: ExtendedTicket) => getShowtimeDetails(row),
      cell: (row: ExtendedTicket) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{getShowtimeDetails(row)}</span>
        </div>
      ),
    },
    {
      header: "Seat",
      accessorKey: "seatId" as keyof ExtendedTicket,
    },
    {
      header: "Price",
      accessorKey: (row: ExtendedTicket) => `$${row.price.toFixed(2)}`,
    },
    {
      header: "Status",
      accessorKey: "status" as keyof ExtendedTicket,
      cell: (row: ExtendedTicket) => {
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
          <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[row.status]}`}>
            {statusLabels[row.status]}
          </span>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ticket Management</h1>
      </div>

      <DataTable
        data={tickets}
        columns={columns}
        onEdit={handleEditTicket}
        onDelete={handleDeleteTicket}
        searchPlaceholder="Search tickets..."
      />

      {/* Edit Ticket Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Update Ticket Status" size="md">
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
              onClick={() => setIsEditModalOpen(false)}
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Ticket"
        message={`Are you sure you want to permanently delete ticket #${currentTicket?.id}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}

