
import { users } from "@/data/users";
import { User } from "@/types/types";

// Function to get all users
export function getAllUsers(): User[] {
  return users;
}

// Function to get a user by ID
export function getUserById(id: string): User | undefined {
  return users.find((user:User) => user.id === id);
}

// Function to get a user by email
export function getUserByEmail(email: string): User | undefined {
  return users.find((user:User) => user.email === email);
}

// Function to get users by gender
export function getUsersByGender(gender: "F" | "M"): User[] {
  return users.filter((user:User) => user.gender === gender);
}

// Function to get all users who have purchased a specific movie
export function getUsersByMovieId(movieId: string): User[] {
  return users.filter((user:User) => user.movieIdsPurchased.includes(movieId));
}

// Function to get users by a list of user IDs
export function getUsersByIds(ids: string[]): User[] {
  return users.filter((user:User) => ids.includes(user.id));
}

// Function to get all users who have a specific bio keyword
export function getUsersByBioKeyword(keyword: string): User[] {
  return users.filter((user:User) => user.bio?.includes(keyword));
}

// Function to get all users with profile images
export function getUsersWithProfileImages(): User[] {
  return users.filter((user:User)=> user.profileImage !== undefined);
}

// Function to get the total number of users
export function getTotalUserCount(): number {
  return users.length;
}

// Function to get a list of usernames for a specific movie purchase
export function getUsernamesByMovieId(movieId: string): string[] {
  return users
    .filter((user:User) => user.movieIdsPurchased.includes(movieId))
    .map((user:User) => user.username);
}

// Function to check if a user exists by username
export function doesUserExistByUsername(username: string): boolean {
  return users.some((user:User) => user.username === username);
}


