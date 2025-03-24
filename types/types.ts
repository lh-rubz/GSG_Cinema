export interface Movie {
  id: string;
  title: string;
  year: string;
  genre: string;
  rating: string;
  description: string;
  image?: string;
  directorId: string;
  duration?: string;
  releaseDate?: string;
  castIds: string[];
}

export interface Director {
  id: string;
  name: string;
  bio: string;
  image: string;
}

export interface CastMember {
  id: string;
  name: string;
  character: string;
  image: string;
}
export interface Seat {
  id: string;
  number: string;
  age?:"kid"|"adult";
  type: 'standard' | 'premium' ;
  available: boolean;
}

export interface Screen {
  id: string;
  name: string;
  type:("Standard" | "Premium" | "IMAX" | "4DX")[];
  capacity: number;
  rows: number;
  cols: number;
  seatMap?: Seat[][];
}
export interface Showtime {
  id: string;
  movieId: string;
  screenId: string;
  date: string; // DD-MM-YYYY
  time: string; // HH:MM in 24-hour format
  format: '2D' | '3D' | 'imax' | '4dx';
  price: number;
}

export interface Review {
  id: string;
  movieId: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  likedBy: string[]; // Track users who liked this review
  replies: Reply[];//replies ids 
}
export interface Reply {
  id: string;
  userId: string;
  comment: string;
  date: string;
}
export interface User {
  id: string;
  username: string;
  displayName: string;
  bio?:string;
  email:string;
  gender:"F"|"M";
  movieIdsPurchased:string[];
  profileImage?: string;

}
export interface Ticket{
  id: string;
  userId:string;
  showtimeId:string;
  seatId:string;
  price:number;
  purchaseDate:string;
  status:"reserved"|"paid"|"used"|"deleted";
  deleteReason?:string;
}
export interface Receipt{
  id:string;
  userId:string;
  movieId:string;
  ticketsIds:string[];
  totalPrice:number;
  paymentMethod:"credit_card"|"paypal"|"cash"|"voucher";
  receiptDate:string;

}