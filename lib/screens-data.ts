import { screens } from "@/data/screens"; 

import { Screen, Seat } from "@/types/types";

// Function to get all screens
export function getAllScreens(): Screen[] {
  return screens;
}

// Function to get a screen by ID
export function getScreenById(id: string): Screen | undefined {
  return screens.find(screen => screen.id === id);
}

// Function to get screens by type (e.g., "IMAX", "Premium")
export function getScreensByType(type: "Standard" | "Premium" | "IMAX" | "4DX"): Screen[] {
  return screens.filter(screen => screen.type.includes(type));
}

// Function to get all screens that have a specific capacity
export function getScreensByCapacity(capacity: number): Screen[] {
  return screens.filter(screen => screen.capacity >= capacity);
}

// Function to get available seats for a specific screen
export function getAvailableSeatsForScreen(screenId: string): Seat[] | undefined {
  const screen = getScreenById(screenId);
  if (screen && screen.seatMap) {
    return screen.seatMap.flat().filter(seat => seat.available);
  }
  return undefined;
}

// Function to get all screens in a specific row
export function getScreensByRow(row: number): Screen[] {
  return screens.filter(screen => screen.rows === row);
}

// Function to get all screens with a specific number of columns
export function getScreensByColumn(cols: number): Screen[] {
  return screens.filter(screen => screen.cols === cols);
}

// Function to get the total number of screens
export function getTotalScreens(): number {
  return screens.length;
}
