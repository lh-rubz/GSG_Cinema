"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import bcrypt from 'bcryptjs';
import { toast } from 'react-hot-toast'; // Importing react-hot-toast

import type { User, Review, Ticket, Receipt } from '@/types/types';
import { usersApi } from '@/lib/endpoints/users';

const generateUniqueId = async () => {
  let uniqueId = `u-${Math.floor(Math.random() * 1000000)}`;
  
  // Check if the generated ID already exists in the system
  const existingUser = await usersApi.getUser(uniqueId);
  if (existingUser.data) {
    return generateUniqueId();  // If ID exists, recursively generate a new one
  }

  return uniqueId;
};

interface AuthContextType {
  user: (User & { reviews: Review[]; tickets: Ticket[]; receipts: Receipt[] }) | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    username: string;
    displayName: string;
    email: string;
    password: string;
    gender: string;
    bio?: string;
    role: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User> & { currentPassword?: string; password?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<(User & { reviews: Review[]; tickets: Ticket[]; receipts: Receipt[] }) | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Verify the user exists by fetching their data
          const userData = await usersApi.getUser(parsedUser.id);
          setUser(userData.data!);
          setIsAuthenticated(true);
        }
      } catch (err) {
        sessionStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get all users and find matching email
      const users = await usersApi.getUsers({ email });
console.log(users.data);
      if (users.data!.length === 0) {
        throw new Error('User not found');
      }

      const foundUser = users.data![0];
console.log(password, foundUser.password);
      // In a real app, you would verify the password properly (hashed comparison)
      if (!await bcrypt.compare(password, foundUser.password)) {
        throw new Error('Invalid password');
      }

      // Get full user data with relationships
      const userData = await usersApi.getUser(foundUser.id);

      // Store user in session storage (without password)
      const { password: _, ...userToStore } = userData.data!;
      sessionStorage.setItem('user', JSON.stringify(userToStore));

      setUser(userData.data!);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      toast.error(error || 'Login failed'); // Show error notification using react-hot-toast
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: {
    username: string;
    displayName: string;
    email: string;
    password: string;
    gender: string;
    bio?: string;
    role: string;
  }) => {
    setIsLoading(true);
    setError(null);
  
    try {
      const existingUsers = await usersApi.getUsers({ email: userData.email });
      if (existingUsers.data && existingUsers.data.length > 0) {
        throw new Error('Email already in use');
      }
  
      const existingUsernames = await usersApi.getUsers({ username: userData.username });
      if (existingUsernames.data && existingUsernames.data.length > 0) {
        throw new Error('Username already taken');
      }
  
      const uniqueId = await generateUniqueId();
  
      if (!['Admin', 'Staff', 'User'].includes(userData.role)) {
        throw new Error('Invalid role provided');
      }

      const newUser = await usersApi.createUser({
        ...userData,
        id: uniqueId,
        profileImage: '',
        role: userData.role as 'Admin' | 'Staff' | 'User'
      });
  
      if (!newUser.data) {
        throw new Error('Failed to create user');
      }
  
      const userDataWithRelations = await usersApi.getUser(uniqueId);
      
      if (!userDataWithRelations.data) {
        throw new Error('Failed to fetch user data after creation');
      }
  
      const { password: _, ...userToStore } = userDataWithRelations.data;
      sessionStorage.setItem('user', JSON.stringify(userToStore));
  
      setUser(userDataWithRelations.data);
      setIsAuthenticated(true);
      toast.success('Account created successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (userData: Partial<User> & { currentPassword?: string; password?: string }) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      if (userData.password) {
        if (!userData.currentPassword) {
          throw new Error('Current password is required to change password');
        }

        const users = await usersApi.getUsers({ email: user.email });
        if (users.data!.length === 0) {
          throw new Error('User not found');
        }

        const foundUser = users.data![0];
        if (!await bcrypt.compare(userData.currentPassword, foundUser.password)) {
          throw new Error('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
      }

      const { currentPassword, ...updateData } = userData;

      const updatedUser = await usersApi.updateUser(user.id, updateData);

      const userDataWithRelations = await usersApi.getUser(updatedUser.data!.id);

      const { password: _, ...userToStore } = userDataWithRelations.data!;
      sessionStorage.setItem('user', JSON.stringify(userToStore));

      setUser(userDataWithRelations.data!);
      toast.success('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      toast.error(error || 'Update failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      signup,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
