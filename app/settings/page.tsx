"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Loader2, Check, Calendar, DollarSign } from "lucide-react"

interface Settings {
    dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD"
    currency: "USD" | "NIS"
}

export default function SettingsPage() {
    const router = useRouter()
    const [isUpdating, setIsUpdating] = useState(false)
    const [settings, setSettings] = useState<Settings>({
        dateFormat: "DD/MM/YYYY",
        currency: "USD"
    })

    const handleSettingsUpdate = async () => {
        setIsUpdating(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success("Settings updated successfully")
        } catch (error) {
            toast.error("Failed to update settings")
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <main className="container py-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>

                <div className="space-y-8">
                    {/* Date Format Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Date Format</h2>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Choose how dates are displayed throughout the application
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="grid gap-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="date-1"
                                        name="dateFormat"
                                        value="DD/MM/YYYY"
                                        checked={settings.dateFormat === "DD/MM/YYYY"}
                                        onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value as Settings["dateFormat"] })}
                                        className="h-4 w-4 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-500"
                                    />
                                    <label htmlFor="date-1" className="text-sm text-gray-700 dark:text-gray-300">
                                        DD/MM/YYYY (e.g., 31/12/2024)
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="date-2"
                                        name="dateFormat"
                                        value="MM/DD/YYYY"
                                        checked={settings.dateFormat === "MM/DD/YYYY"}
                                        onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value as Settings["dateFormat"] })}
                                        className="h-4 w-4 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-500"
                                    />
                                    <label htmlFor="date-2" className="text-sm text-gray-700 dark:text-gray-300">
                                        MM/DD/YYYY (e.g., 12/31/2024)
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="date-3"
                                        name="dateFormat"
                                        value="YYYY-MM-DD"
                                        checked={settings.dateFormat === "YYYY-MM-DD"}
                                        onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value as Settings["dateFormat"] })}
                                        className="h-4 w-4 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-500"
                                    />
                                    <label htmlFor="date-3" className="text-sm text-gray-700 dark:text-gray-300">
                                        YYYY-MM-DD (e.g., 2024-12-31)
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Currency Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Currency</h2>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Select your preferred currency for prices and transactions
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="grid gap-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="currency-1"
                                        name="currency"
                                        value="USD"
                                        checked={settings.currency === "USD"}
                                        onChange={(e) => setSettings({ ...settings, currency: e.target.value as Settings["currency"] })}
                                        className="h-4 w-4 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-500"
                                    />
                                    <label htmlFor="currency-1" className="text-sm text-gray-700 dark:text-gray-300">
                                        USD ($) - US Dollar
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="currency-2"
                                        name="currency"
                                        value="NIS"
                                        checked={settings.currency === "NIS"}
                                        onChange={(e) => setSettings({ ...settings, currency: e.target.value as Settings["currency"] })}
                                        className="h-4 w-4 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-500"
                                    />
                                    <label htmlFor="currency-2" className="text-sm text-gray-700 dark:text-gray-300">
                                        NIS (₪) - New Israeli Shekel
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Settings Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSettingsUpdate}
                            disabled={isUpdating}
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Save Settings
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
} 
