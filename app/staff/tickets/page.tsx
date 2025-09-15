"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Ticket, Search, Filter, CheckCircle, Clock, AlertCircle, XCircle, Eye, Edit, RefreshCw } from "lucide-react"
import { Modal } from "@/components/modal"
import { DataTable } from "@/components/data-table"
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

  // Define table columns for the DataTable
  const columns = [
    {
      header: "Screen",
      accessorKey: "screen" as keyof ExtendedTicket,
      cell: (ticket: ExtendedTicket) => (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="font-medium text-zinc-900 dark:text-white">
            {ticket.showtime?.screen?.name || "Unknown Screen"}
          </span>
        </div>
      )
    },
    {
      header: "Customer",
      accessorKey: "customer" as keyof ExtendedTicket,
      cell: (ticket: ExtendedTicket) => (
        <div>
          <div className="font-medium text-zinc-900 dark:text-white">
            {ticket.user?.displayName || "Unknown User"}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {ticket.user?.email || "No email"}
          </div>
        </div>
      )
    },
    {
      header: "Movie",
      accessorKey: "movie" as keyof ExtendedTicket,
      cell: (ticket: ExtendedTicket) => (
        <div>
          <div className="font-medium text-zinc-900 dark:text-white">
            {ticket.showtime?.movie?.title || "Unknown Movie"}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {ticket.showtime?.format || "Standard"}
          </div>
        </div>
      )
    },
    {
      header: "Showtime",
      accessorKey: "showtime" as keyof ExtendedTicket,
      cell: (ticket: ExtendedTicket) => (
        <div>
          <div className="font-medium text-zinc-900 dark:text-white">
            {ticket.showtime?.date || "TBD"}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {ticket.showtime?.time || "TBD"}
          </div>
        </div>
      )
    },
    {
      header: "Seat",
      accessorKey: "seatId" as keyof ExtendedTicket,
      cell: (ticket: ExtendedTicket) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
            {ticket.seatId}
          </div>
        </div>
      )
    },
    {
      header: "Price",
      accessorKey: "price" as keyof ExtendedTicket,
      cell: (ticket: ExtendedTicket) => (
        <div className="font-semibold text-zinc-900 dark:text-white">
          ${ticket.showtime?.price || 0}
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "status" as keyof ExtendedTicket,
      cell: (ticket: ExtendedTicket) => {
        const statusConfig = {
          paid: { 
            bg: "bg-green-100 dark:bg-green-900/30", 
            text: "text-green-800 dark:text-green-400", 
            icon: CheckCircle 
          },
          reserved: { 
            bg: "bg-amber-100 dark:bg-amber-900/30", 
            text: "text-amber-800 dark:text-amber-400", 
            icon: Clock 
          },
          used: { 
            bg: "bg-blue-100 dark:bg-blue-900/30", 
            text: "text-blue-800 dark:text-blue-400", 
            icon: CheckCircle 
          },
          deleted: { 
            bg: "bg-red-100 dark:bg-red-900/30", 
            text: "text-red-800 dark:text-red-400", 
            icon: XCircle 
          }
        }
        
        const config = statusConfig[ticket.status as keyof typeof statusConfig] || statusConfig.reserved
        const Icon = config.icon
        
        return (
          <div className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${config.bg} ${config.text}`}>
            <Icon className="h-3 w-3" />
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
          </div>
        )
      }
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading tickets...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-2xl"></div>
        <div className="relative p-6 rounded-2xl border border-blue-200/20 dark:border-blue-800/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Ticket Management
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                Manage customer tickets and reservations
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {filteredTickets.length}
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Total Tickets
                </div>
              </div>
              <button
                onClick={fetchTickets}
                className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="search"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="reserved">Reserved</option>
              <option value="paid">Paid</option>
              <option value="used">Used</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>

          {/* Status Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-zinc-600 dark:text-zinc-400">
                {tickets.filter(t => t.status === 'paid').length} Paid
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-zinc-600 dark:text-zinc-400">
                {tickets.filter(t => t.status === 'reserved').length} Reserved
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-zinc-600 dark:text-zinc-400">
                {tickets.filter(t => t.status === 'used').length} Used
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 overflow-hidden">
        <DataTable
          data={filteredTickets}
          columns={columns}
          onEdit={handleUpdateTicket}
          searchPlaceholder="Search tickets..."
        />
      </div>

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Ticket Status"
        size="lg"
      >
        <div className="space-y-6">
          {/* Current Ticket Info Header */}
          {currentTicket && (
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-xl p-4 border border-blue-200/30 dark:border-blue-800/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Ticket className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white">Ticket #{currentTicket.id}</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Update ticket status and details</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">Movie:</span>
                  <p className="font-medium text-zinc-900 dark:text-white">{getMovieTitle(currentTicket)}</p>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">Customer:</span>
                  <p className="font-medium text-zinc-900 dark:text-white">{getUserName(currentTicket)}</p>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">Seat:</span>
                  <p className="font-medium text-zinc-900 dark:text-white">{currentTicket.seatId}</p>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">Current Status:</span>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${
                      currentTicket.status === "paid"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : currentTicket.status === "reserved"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        : currentTicket.status === "used"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {currentTicket.status === "paid" && <CheckCircle className="h-3 w-3" />}
                      {currentTicket.status === "reserved" && <Clock className="h-3 w-3" />}
                      {currentTicket.status === "used" && <CheckCircle className="h-3 w-3" />}
                      {currentTicket.status === "deleted" && <XCircle className="h-3 w-3" />}
                      {currentTicket.status.charAt(0).toUpperCase() + currentTicket.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status Field */}
          <div className="space-y-3">
            <label htmlFor="status" className="block text-sm font-semibold text-zinc-900 dark:text-white">
              New Ticket Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status || "reserved"}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="reserved">🕐 Reserved</option>
              <option value="paid">✅ Paid</option>
              <option value="used">🎬 Used</option>
              <option value="deleted">❌ Deleted</option>
            </select>
          </div>

          {/* Delete Reason Field - only show when status is deleted */}
          {formData.status === "deleted" && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
              <label htmlFor="deleteReason" className="block text-sm font-semibold text-zinc-900 dark:text-white">
                Reason for Deletion
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <AlertCircle className="absolute left-3 top-3 h-4 w-4 text-red-500" />
                <textarea
                  id="deleteReason"
                  name="deleteReason"
                  value={formData.deleteReason || ""}
                  onChange={handleInputChange}
                  placeholder="Please provide a detailed reason for deleting this ticket..."
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-red-200 dark:border-red-700 bg-red-50/50 dark:bg-red-900/10 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all duration-200 resize-none"
                />
              </div>
              <p className="text-xs text-red-600 dark:text-red-400">
                This action will permanently mark the ticket as deleted and cannot be undone.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200/50 dark:border-zinc-700/50">
            <button
              onClick={() => setIsUpdateModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 focus:ring-2 focus:ring-zinc-500/20 focus:outline-none transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTicket}
              disabled={formData.status === "deleted" && !formData.deleteReason?.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

