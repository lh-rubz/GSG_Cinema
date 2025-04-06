'use client';

import { useState } from 'react';
import { FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';

import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/use-auth';

export default function SignUpForm() {
    const { signup, isLoading } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        bio: '',
        displayName: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!formData.gender) {
            toast.error('Please select your gender');
            return;
        }

        try {
            await signup({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                gender: formData.gender,
                bio: formData.bio,
                displayName: formData.displayName || formData.username
            });
            toast.success('Account created successfully!');
        } catch (error) {
            // Error is already handled in the AuthContext
        }
    };

    return (
        <div className="w-full max-w-md mx-4 my-8">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg space-y-6">
                <div className="text-center">
                    <h2 className="text-black dark:text-white text-2xl font-semibold mb-2">Create an Account</h2>
                    <p className="text-gray-600 dark:text-gray-400">Sign up to access exclusive features and book tickets</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-800 dark:text-gray-300 mb-2 font-medium">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="w-full p-3 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-red-600 focus:outline-none"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-800 dark:text-gray-300 mb-2 font-medium">Display Name</label>
                        <input
                            type="text"
                            name="displayName"
                            className="w-full p-3 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-red-600 focus:outline-none"
                            placeholder="Your display name"
                            value={formData.displayName}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-800 dark:text-gray-300 mb-2 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full p-3 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-red-600 focus:outline-none"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-gray-800 dark:text-gray-300 mb-2 font-medium">Password</label>
                        <div className="relative w-full">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                className="w-full p-3 pr-10 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-red-600 focus:outline-none"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-white"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-800 dark:text-gray-300 mb-2 font-medium">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="w-full p-3 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-red-600 focus:outline-none"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-800 dark:text-gray-300 mb-2 font-medium">Gender</label>
                        <select
                            name="gender"
                            className="w-full p-3 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-red-600 focus:outline-none"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-800 dark:text-gray-300 mb-2 font-medium">Bio (Optional)</label>
                        <textarea
                            name="bio"
                            className="w-full p-3 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-red-600 focus:outline-none"
                            placeholder="Tell us about yourself"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-2 p-3 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating account...' : 'Sign Up'} <FaUserPlus />
                    </button>

                    <p className="text-gray-600 dark:text-gray-400 text-center pt-4">
                        Already have an account? <a href="/signin" className="text-red-600 dark:text-red-400 hover:underline">Sign in</a>
                    </p>
                </form>
            </div>
        </div>
    );
}