"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2, Check, Clock, DollarSign, Hourglass } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePreferences } from "@/context/PreferencesContext";

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth();
  const { preferences, isLoading: prefsLoading, updatePreferences } = usePreferences();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSettingsUpdate = async () => {
    try {
      setIsUpdating(true);
      await updatePreferences(preferences);
      toast.success("Settings saved successfully", {
        style: {
          background: "#10b981",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Failed to update settings", {
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSettingChange = (field: keyof typeof preferences, value: string) => {
    updatePreferences({ [field]: value });
  };

  if (!isAuthenticated || !user) {
    return (
      <main className="container p-8 mt-10 md:py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="p-6 bg-red-100 text-red-800 rounded-lg dark:bg-red-900/30 dark:text-red-400">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p>You need to be logged in to view and manage your settings.</p>
          </div>
        </div>
      </main>
    );
  }

  if (prefsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="container p-8 mt-10 md:py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Account Settings
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage your application preferences and display options
          </p>
        </div>

        <div className="space-y-6">
          {/* Time Format Section */}
          <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700">
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Time Format
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Choose how times are displayed throughout the application
                  </p>
                  <div className="mt-6 space-y-3">
                    {[
                      {
                        id: "time-12h",
                        value: "TWELVE_HOUR",
                        label: "12-hour format (e.g., 2:30 PM)",
                      },
                      {
                        id: "time-24h",
                        value: "TWENTY_FOUR_HOUR",
                        label: "24-hour format (e.g., 14:30)",
                      },
                    ].map((option) => (
                      <div key={option.id} className="flex items-center">
                        <input
                          id={option.id}
                          name="timeFormat"
                          type="radio"
                          checked={preferences.timeFormat === option.value}
                          onChange={() => handleSettingChange("timeFormat", option.value)}
                          className="h-4 w-4 border-zinc-300 text-red-600 focus:ring-red-500 dark:border-zinc-600 dark:bg-zinc-800 dark:checked:bg-red-600 dark:focus:ring-red-500"
                        />
                        <label
                          htmlFor={option.id}
                          className="ml-3 block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Duration Format Section */}
          <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700">
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  <Hourglass className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Duration Display
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Choose how durations are displayed (movie lengths, etc.)
                  </p>
                  <div className="mt-6 space-y-3">
                    {[
                      {
                        id: "duration-minutes",
                        value: "MINUTES_ONLY",
                        label: "Minutes only (e.g., 120 min)",
                      },
                      {
                        id: "duration-hours",
                        value: "HOURS_AND_MINUTES",
                        label: "Hours and minutes (e.g., 2h 0m)",
                      },
                    ].map((option) => (
                      <div key={option.id} className="flex items-center">
                        <input
                          id={option.id}
                          name="durationFormat"
                          type="radio"
                          checked={preferences.durationFormat === option.value}
                          onChange={() => handleSettingChange("durationFormat", option.value)}
                          className="h-4 w-4 border-zinc-300 text-red-600 focus:ring-red-500 dark:border-zinc-600 dark:bg-zinc-800 dark:checked:bg-red-600 dark:focus:ring-red-500"
                        />
                        <label
                          htmlFor={option.id}
                          className="ml-3 block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Currency Section */}
          <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700">
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Currency
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Select your preferred currency for prices and transactions
                  </p>
                  <div className="mt-6 space-y-3">
                    {[
                      { id: "currency-1", value: "USD", label: "USD ($) - US Dollar" },
                      { id: "currency-2", value: "NIS", label: "NIS (₪) - New Israeli Shekel" },
                    ].map((option) => (
                      <div key={option.id} className="flex items-center">
                        <input
                          id={option.id}
                          name="currency"
                          type="radio"
                          checked={preferences.currency === option.value}
                          onChange={() => handleSettingChange("currency", option.value)}
                          className="h-4 w-4 border-zinc-300 text-red-600 focus:ring-red-500 dark:border-zinc-600 dark:bg-zinc-800 dark:checked:bg-red-600 dark:focus:ring-red-500"
                        />
                        <label
                          htmlFor={option.id}
                          className="ml-3 block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSettingsUpdate}
              disabled={isUpdating}
              className="inline-flex items-center justify-center gap-x-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-700 dark:hover:bg-red-600"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}