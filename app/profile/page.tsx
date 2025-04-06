'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, Settings, Ticket as TicketIcon, Calendar, Tag, Edit, Mail, MessageSquare } from "lucide-react";
import type { Review, Ticket } from "../../types/types";

// Temporary mock data
const mockUser = {
  username: "Mohammad",
  role: "user",
  email: "mohammad@example.com"
};



export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tickets' | 'reviews'>('dashboard');
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);


  const handleSignOut = () => {
    // Implement your sign out logic here
    router.push("/");
  };

  const renderDashboardContent = () => {
    return (
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => router.push("/tickets")}
          className="flex flex-col items-center justify-center p-6 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="w-10 h-10 flex items-center justify-center mb-2">
            <TicketIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          <span className="text-sm font-medium dark:text-white">My Tickets</span>
        </button>
        <button
          onClick={() => router.push("/showtimes")}
          className="flex flex-col items-center justify-center p-6 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="w-10 h-10 flex items-center justify-center mb-2">
            <Calendar className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          <span className="text-sm font-medium dark:text-white">Book Tickets</span>
        </button>
        <button
          onClick={() => router.push("/promotions")}
          className="flex flex-col items-center justify-center p-6 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="w-10 h-10 flex items-center justify-center mb-2">
            <Tag className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          <span className="text-sm font-medium dark:text-white">Promotions</span>
        </button>
        <button
          onClick={() => router.push("/settings")}
          className="flex flex-col items-center justify-center p-6 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="w-10 h-10 flex items-center justify-center mb-2">
            <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          <span className="text-sm font-medium dark:text-white">Account Settings</span>
        </button>
      </div>
    );
  };

  const renderTicketsContent = () => {
    if (userTickets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-6">
          <TicketIcon className="w-12 h-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold dark:text-white">No tickets yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">You haven't purchased any tickets yet.</p>
          <button
            onClick={() => router.push("/showtimes")}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Browse Showtimes
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {userTickets.map((ticket) => (
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
                  : ticket.status === "used"
                    ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    : ticket.status === "deleted"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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

  const renderReviewsContent = () => {
    if (userReviews.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-6">
          <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold dark:text-white">No reviews yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">You haven't reviewed any movies yet.</p>
          <button
            onClick={() => router.push("/movies")}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Browse Movies
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {userReviews.map((review) => (
          <div key={review.id} className="p-4 border dark:border-gray-700 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium dark:text-white">title</h3>
                <div className="flex items-center gap-2 my-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">
                      {star <= review.rating ? "★" : "☆"}
                    </span>
                  ))}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
                {review.replies.length > 0 && (
                  <div className="mt-3 pl-4 border-l-2 border-gray-100 dark:border-gray-700">
                    {review.replies.map((reply: string) => {
                      return (
                          <p className="text-sm text-gray-600 dark:text-gray-300">{reply}</p>
                      );
                    })}
                  </div>
                )}
                {review.likedBy.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {review.likedBy.length} {review.likedBy.length === 1 ? 'person likes' : 'people like'} this review
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-4 w-4" />
                <span>{review.replies.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-900 px-4 py-16 mt-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 dark:text-white">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          {/* Account Info - Left Side */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm h-fit">
            <h2 className="text-xl font-semibold dark:text-white">Account Info</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Your account details</p>
            
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
                <Image
                  src="/placeholder.svg"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold dark:text-white">{mockUser.username}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{mockUser.role}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                <Mail className="h-3 w-3" />
                {mockUser.email}
              </p>
            </div>
            
            <div className="space-y-3">
              <button className="w-full py-2.5 px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors dark:text-white">
                <Edit size={18} />
                <span>Edit Profile</span>
              </button>
              <button 
                onClick={handleSignOut}
                className="w-full py-2.5 px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors dark:text-white"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* My Activities - Right Side */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6 pb-0">
              <h2 className="text-xl font-semibold dark:text-white">My Activities</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Track your recent activities</p>
            </div>
            
            {/* Tab Navigation */}
            <div className="px-6 mt-4">
              <div className="flex gap-4 border-b border-gray-100 dark:border-gray-700">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 border-b-2 ${
                    activeTab === 'dashboard' 
                      ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' 
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveTab('tickets')}
                  className={`px-4 py-2 border-b-2 ${
                    activeTab === 'tickets' 
                      ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' 
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  My Tickets
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`px-4 py-2 border-b-2 ${
                    activeTab === 'reviews' 
                      ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' 
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  My Reviews
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'dashboard' && renderDashboardContent()}

              {activeTab === 'tickets' && (
                <div className="max-h-[250px] overflow-y-auto pr-2">
                  {renderTicketsContent()}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="max-h-[250px] overflow-y-auto pr-2">
                  {renderReviewsContent()}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}