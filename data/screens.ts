import { Screen } from "@/types/types";
import { Seat } from "@/types/types";

export const screens: Screen[] = [
  {
    id: "s1",
    name: "Screen 1",
    type: ["Standard"],
    capacity: 120,
    rows: 10,
    cols: 12,
    seatMap: generateSeatMap(10, 12)
  },
  {
    id: "s2",
    name: "Screen 2",
    type: ["Standard","FourDX"],
    capacity: 100,
    rows: 8,
    cols: 12,
    seatMap: generateSeatMap(8, 12)
  },
  {
    id: "s3",
    name: "Screen 3",
    type: ["Premium"],
    capacity: 80,
    rows: 8,
    cols: 10,
    seatMap: generateSeatMap(8, 10) 
  },
  {
    id: "s4",
    name: "Screen 4",
    type: ["IMAX"],
    capacity: 150,
    rows: 12,
    cols: 15,
    seatMap: generateSeatMap(12, 15)
  }
];


export function generateSeatMap(rows: number, cols: number): Seat[][] {
    const seatMap: Seat[][] = [];
    const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let r = 0; r < rows; r++) {
      const row: Seat[] = [];
      for (let c = 0; c < cols; c++) {
        const seatNumber = `${rowLetters[r]}${c+1}`;
        row.push({
          id: `s1_${seatNumber}`,
          number: seatNumber,
          type: r === 0 ? 'premium' : 'standard', // Only first row is premium
          available: true,
          screenId: 's1',
          row: r,
          col: c
        });
      }
      seatMap.push(row);
    }
    return seatMap;
  }
 export const calculateTotal = (seats: Seat[]) => {
    return seats.reduce((total, seat) => {
      return total + (seat.type === 'premium' ? 50 : 30);
    }, 0);
  };