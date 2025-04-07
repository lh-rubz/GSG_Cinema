'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Save, Camera } from "lucide-react";

// Temporary mock data - in a real app, this would come from a context or API
const mockUser = {
    username: "Mohammad",
    role: "user",
    email: "mohammad@example.com",
    profileImage: "",
    bio: "Movie enthusiast and cinema lover"
};

export default function EditProfilePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: mockUser.username,
        profileImage: mockUser.profileImage,
        bio: mockUser.bio,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Get the first letter of the username for the default avatar
    const getInitials = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    // Check if the profile image is valid or empty
    const hasValidImage = formData.profileImage && formData.profileImage.trim() !== "";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        // Validate passwords if trying to change password
        if (formData.newPassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                setError("New passwords do not match");
                setIsLoading(false);
                return;
            }
            if (!formData.currentPassword) {
                setError("Current password is required to change password");
                setIsLoading(false);
                return;
            }
        }

        try {
            // In a real app, this would be an API call
            // await updateProfile(formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSuccess("Profile updated successfully");

            // Redirect back to profile page after a short delay
            setTimeout(() => {
                router.push("/profile");
            }, 1500);
        } catch (err) {
            setError("Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="bg-gray-50 dark:bg-gray-900 px-4 py-16 mt-16">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => router.push("/profile")}
                        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span>Back to Profile</span>
                    </button>
                </div>

                <h1 className="text-2xl font-bold mb-6 dark:text-white">Edit Profile</h1>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-lg mb-6">
                        {success}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Profile Photo
                            </label>
                            <div className="flex items-center space-x-4">
                                <div className="relative w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
                                    {hasValidImage ? (
                                        <Image
                                            src={formData.profileImage}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-2xl font-bold">
                                            {getInitials(formData.username)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        name="profileImage"
                                        value={formData.profileImage}
                                        onChange={handleChange}
                                        placeholder="Enter image URL or leave empty for default"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Leave empty to use your initial as profile picture
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Tell us about yourself"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={mockUser.email}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Password</h2>

                            <div className="mb-4">
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => router.push("/profile")}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mr-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
} 