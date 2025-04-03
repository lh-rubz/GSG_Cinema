'use client';

import { useState } from 'react';
import { FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function SignUpForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="w-full max-w-md mx-4 my-8">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg space-y-6">
                <div className="text-center">
                    <h2 className="text-black dark:text-white text-2xl font-semibold mb-2">Create an Account</h2>
                    <p className="text-gray-600 dark:text-gray-400">Sign up to access exclusive features and book tickets</p>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-gray-800 dark:text-gray-300 mb-2 font-medium">Username</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-red-600 focus:outline-none"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-800 dark:text-gray-300 mb-2 font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-red-600 focus:outline-none"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-gray-800 dark:text-gray-300 mb-2 font-medium">Password</label>
                        <div className="relative w-full">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="w-full p-3 pr-10 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-red-600 focus:outline-none"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            className="w-full p-3 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-red-600 focus:outline-none"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-800 dark:text-gray-300 mb-2 font-medium">Gender</label>
                        <select
                            className="w-full p-3 rounded bg-gray-200 dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 focus:border-red-600 focus:outline-none"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>

                <button className="w-full flex justify-center items-center gap-2 p-3 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition font-medium">
                    Sign Up <FaUserPlus />
                </button>

                <p className="text-gray-600 dark:text-gray-400 text-center pt-4">
                    Already have an account? <a href="/signin" className="text-red-600 dark:text-red-400 hover:underline">Sign in</a>
                </p>
            </div>
        </div>
    );
}