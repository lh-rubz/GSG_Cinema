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
  email: "mohammad@example.com",
  profileImage: ""
};

export default function ProfilePage() {
  const router = useRouter();

  // Get the first letter of the username for the default avatar
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Check if the profile image is valid or empty
  const hasValidImage = mockUser.profileImage && mockUser.profileImage.trim() !== "";

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
              <div className="relative w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden flex items-center justify-center">
                {hasValidImage ? (
                  <Image
                    src={mockUser.profileImage}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-3xl font-bold">
                    {getInitials(mockUser.username)}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold dark:text-white">{mockUser.username}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{mockUser.role}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                <Mail className="h-3 w-3" />
                {mockUser.email}
              </p>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => router.push("/profile/edit")}
                className="w-full py-2.5 px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors dark:text-white"
              >
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

          {/* Dashboard - Right Side */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6 pb-0">
              <h2 className="text-xl font-semibold dark:text-white">Dashboard</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Quick access to your activities</p>
            </div>
            
            <div className="p-6">
              {renderDashboardContent()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}