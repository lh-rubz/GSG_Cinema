'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ticket as TicketIcon } from "lucide-react";
import type { Ticket } from "../../types/types";

// Temporary mock data for tickets
const mockActiveTickets: Ticket[] = [
  {
    id: "t1",
    userId: "mohammad",
    showtimeId: "st1",
    seatId: "A12",
    price: 15.99,
    purchaseDate: "2024-03-15T10:00:00Z",
    status: "paid"
  },
  {
    id: "t1",
    userId: "mohammad",
    showtimeId: "st1",
    seatId: "A12",
    price: 15.99,
    purchaseDate: "2024-03-15T10:00:00Z",
    status: "paid"
  },
  {
    id: "t1",
    userId: "mohammad",
    showtimeId: "st1",
    seatId: "A12",
    price: 15.99,
    purchaseDate: "2024-03-15T10:00:00Z",
    status: "paid"
  },
  {
    id: "t1",
    userId: "mohammad",
    showtimeId: "st1",
    seatId: "A12",
    price: 15.99,
    purchaseDate: "2024-03-15T10:00:00Z",
    status: "paid"
  },
  {
    id: "t1",
    userId: "mohammad",
    showtimeId: "st1",
    seatId: "A12",
    price: 15.99,
    purchaseDate: "2024-03-15T10:00:00Z",
    status: "paid"
  },
  
];

const mockPastTickets: Ticket[] = [
  {
    id: "t2",
    userId: "mohammad",
    showtimeId: "st2",
    seatId: "B15",
    price: 12.99,
    purchaseDate: "2024-03-10T15:30:00Z",
    status: "used"
  }
];

export default function TicketsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [activeTickets, setActiveTickets] = useState<Ticket[]>(mockActiveTickets);
  const [pastTickets, setPastTickets] = useState<Ticket[]>(mockPastTickets);

  const renderActiveTickets = () => {
    if (activeTickets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-6">
          <TicketIcon className="w-12 h-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold dark:text-white">No active tickets</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">You don't have any upcoming movie tickets.</p>
          <button
            onClick={() => router.push("/showtimes")}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Book Tickets
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {activeTickets.map((ticket) => (
          <div key={ticket.id} className="p-4 border dark:border-gray-700 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium dark:text-white">Seat {ticket.seatId}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Price: ${ticket.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Purchased: {new Date(ticket.purchaseDate).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                ticket.status === "paid" 
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              }`}>
                {ticket.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPastTickets = () => {
    if (pastTickets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-6">
          <TicketIcon className="w-12 h-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold dark:text-white">No past tickets</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">You don't have any past movie tickets.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {pastTickets.map((ticket) => (
          <div key={ticket.id} className="p-4 border dark:border-gray-700 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium dark:text-white">Seat {ticket.seatId}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Price: ${ticket.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Purchased: {new Date(ticket.purchaseDate).toLocaleDateString()}
                </p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                {ticket.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-900 px-4 py-16 mt-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 dark:text-white">My Tickets</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {/* Tab Navigation */}
          <div className="px-6 pt-6">
            <div className="flex gap-4 border-b border-gray-100 dark:border-gray-700">
              <button 
                onClick={() => setActiveTab('active')}
                className={`px-4 py-2 border-b-2 ${
                  activeTab === 'active' 
                    ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Active Tickets
              </button>
              <button 
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 border-b-2 ${
                  activeTab === 'past' 
                    ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Past Tickets
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'active' && (
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {renderActiveTickets()}
              </div>
            )}

            {activeTab === 'past' && (
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {renderPastTickets()}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 
