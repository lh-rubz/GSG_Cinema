"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, Settings, Ticket as TicketIcon, Calendar, Tag, Edit, Mail, MessageSquare, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Loading from "../loading";


export default function ProfilePage() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get the first letter of the username for the default avatar
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Check if the profile image is valid or empty
  const hasValidImage = user?.profileImage && user?.profileImage.trim() !== "";

  const handleSignOut = () => {
    setShowLogoutDialog(true);
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const confirmLogout = () => {
    setIsLoggingOut(true);
    logout();
    router.push("/");
  };

  const renderDashboardContent = () => {
    return (
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => router.push("/tickets")}
          className="flex flex-col items-center justify-center p-6 border border-zinc-100 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
        >
          <div className="w-10 h-10 flex items-center justify-center mb-2">
            <TicketIcon className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </div>
          <span className="text-sm font-medium dark:text-white">My Tickets</span>
        </button>
        <button
          onClick={() => router.push("/showtimes")}
          className="flex flex-col items-center justify-center p-6 border border-zinc-100 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
        >
          <div className="w-10 h-10 flex items-center justify-center mb-2">
            <Calendar className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </div>
          <span className="text-sm font-medium dark:text-white">Book Tickets</span>
        </button>
        <button
          onClick={() => router.push("/promotions")}
          className="flex flex-col items-center justify-center p-6 border border-zinc-100 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
        >
          <div className="w-10 h-10 flex items-center justify-center mb-2">
            <Tag className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </div>
          <span className="text-sm font-medium dark:text-white">Promotions</span>
        </button>
        <button
          onClick={() => router.push("/settings")}
          className="flex flex-col items-center justify-center p-6 border border-zinc-100 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
        >
          <div className="w-10 h-10 flex items-center justify-center mb-2">
            <Settings className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </div>
          <span className="text-sm font-medium dark:text-white">Account Settings</span>
        </button>
      </div>
    );
  };

  return (
    <>
     
      {/* Modern Logout Confirmation Dialog */}
      {showLogoutDialog && !isLoggingOut && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl p-0 max-w-md w-full shadow-2xl border border-zinc-200/50 dark:border-zinc-700/50 transform transition-all duration-300 animate-in fade-in-0 zoom-in-95">
            
            {/* Header with Gradient Background */}
            <div className="relative overflow-hidden rounded-t-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-600/20 dark:to-orange-600/20"></div>
              <div className="relative p-6 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <LogOut className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Sign Out</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Confirm your action</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-2">
              <div className="bg-zinc-50/80 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200/30 dark:border-zinc-700/30">
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  Are you sure you want to sign out of your account? You'll be redirected to the home page and will need to sign in again to access your profile.
                </p>
              </div>
            </div>

            {/* User Info Preview */}
            <div className="px-6 pb-4">
              <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-zinc-800/60 rounded-xl border border-zinc-200/30 dark:border-zinc-700/30">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                  {user ? getInitials(user.username) : "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                    {user?.displayName || user?.username || "User"}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {user?.email || "No email"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-6">
              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="bg-zinc-50 dark:bg-zinc-900 px-4 py-16 mt-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-8 dark:text-white">My Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
            {/* Account Info - Left Side */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm h-fit">
              <h2 className="text-xl font-semibold dark:text-white">Account Info</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">Your account details</p>
              
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-24 h-24 bg-zinc-200 dark:bg-zinc-700 rounded-full mb-4 overflow-hidden flex items-center justify-center">
                  {hasValidImage ? (
                    <Image
                      src={user?.profileImage || ""}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-red-600 text-white text-3xl font-bold">
                      {user ? getInitials(user.username) : ""}
                    </div>
                  )}
                </div>
                {user && (
                  <>
                    <h3 className="text-lg font-semibold dark:text-white">{user.username}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 capitalize">{user.role}</p>
                  </>
                )}
                <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
                  <Mail className="h-3 w-3" />
                  {user?.email || "Email not available"}
                </p>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={() => router.push("/profile/edit")}
                  className="w-full py-2.5 px-4 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-600 transition-colors dark:text-white"
                >
                  <Edit size={18} />
                  <span>Edit Profile</span>
                </button>
                <button 
                  onClick={handleSignOut}
                  className="w-full py-2.5 px-4 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-600 transition-colors dark:text-white"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Dashboard - Right Side */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
              <div className="p-6 pb-0">
                <h2 className="text-xl font-semibold dark:text-white">Dashboard</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">Quick access to your activities</p>
              </div>
              
              <div className="p-6">
                {renderDashboardContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}