"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { preferencesApi } from "@/lib/endpoints/preferences";
import { useAuth } from "@/hooks/use-auth";

export type TimeFormat = "TWELVE_HOUR" | "TWENTY_FOUR_HOUR";
export type DurationFormat = "MINUTES_ONLY" | "HOURS_AND_MINUTES";
export type CurrencyType = "USD" | "NIS";

export interface Preferences {
  timeFormat: TimeFormat;
  durationFormat: DurationFormat;
  currency: CurrencyType;
}

interface PreferencesContextProps {
  preferences: Preferences;
  isLoading: boolean;
  updatePreferences: (newPreferences: Partial<Preferences>) => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextProps | undefined>(undefined);

// Default preferences (used when user is not logged in or hasn't set preferences)
const DEFAULT_PREFERENCES: Preferences = {
  timeFormat: "TWENTY_FOUR_HOUR",
  durationFormat: "MINUTES_ONLY",
  currency: "NIS",
};

export const PreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (isAuthenticated && user) {
        try {
          setIsLoading(true);
          const response = await preferencesApi.getUserPreferences(user.id);
          if (response.data) {
            setPreferences(response.data);
          }
        } catch (error) {
          console.error("Error fetching preferences:", error);
          // Fall back to defaults if API fails
          setPreferences(DEFAULT_PREFERENCES);
        } finally {
          setIsLoading(false);
        }
      } else {
        // For non-authenticated users, use defaults
        setPreferences(DEFAULT_PREFERENCES);
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [user, isAuthenticated]);

  const updatePreferences = async (newPreferences: Partial<Preferences>) => {
    if (!user || !isAuthenticated) {
      // For non-logged-in users, just update local state
      setPreferences(prev => ({ ...prev, ...newPreferences }));
      return;
    }

    try {
      setIsLoading(true);
      const updatedPrefs = { ...preferences, ...newPreferences };
      await preferencesApi.updateUserPreferences(user.id, updatedPrefs);
      setPreferences(updatedPrefs);
    } catch (error) {
      console.error("Error updating preferences:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PreferencesContext.Provider value={{ preferences, isLoading, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};