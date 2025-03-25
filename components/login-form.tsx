'use client';

import { useState } from 'react';
import { FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-zinc-900 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-white text-2xl font-semibold mb-2">Sign In</h2>
                <p className="text-gray-400 mb-6">Enter your credentials to access your account</p>

                <div className="mb-4">
                    <label className="block text-gray-300 mb-1">Username</label>
                    <input
                        type="text"
                        className="w-full p-3 rounded bg-zinc-800 text-white border border-gray-700 focus:border-red-600 focus:outline-none"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-4 relative">
                    <label className="block text-gray-300 mb-1">Password</label>
                    <div className="relative w-full">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full p-3 pr-10 rounded bg-zinc-800 text-white border border-gray-700 focus:border-red-600 focus:outline-none"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-white"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <button className="w-full flex justify-center items-center gap-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    Sign In <FaSignInAlt />
                </button>

                <p className="text-gray-400 text-center mt-4">
                    Don't have an account? <a href="/signup" className="text-red-600">Sign up</a>
                </p>
            </div>
        </div>
    );
}
