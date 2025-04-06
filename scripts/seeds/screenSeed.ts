

import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

(async () => {
  try {
    const screenData = [

        {
            "id": "s1",
            "name": "Screen 1",
            "type": ["Standard"],
            "capacity": 120,
            "rows": 10,
            "cols": 12,
            "seatMap": [
              [
                {"id": "s1_A1", "number": "A1", "type": "premium", "available": true, "row": 0, "col": 0},
                {"id": "s1_A2", "number": "A2", "type": "premium", "available": true, "row": 0, "col": 1},
                {"id": "s1_A3", "number": "A3", "type": "premium", "available": true, "row": 0, "col": 2},
                {"id": "s1_A4", "number": "A4", "type": "premium", "available": true, "row": 0, "col": 3},
                {"id": "s1_A5", "number": "A5", "type": "premium", "available": true, "row": 0, "col": 4},
                {"id": "s1_A6", "number": "A6", "type": "premium", "available": true, "row": 0, "col": 5},
                {"id": "s1_A7", "number": "A7", "type": "premium", "available": true, "row": 0, "col": 6},
                {"id": "s1_A8", "number": "A8", "type": "premium", "available": true, "row": 0, "col": 7},
                {"id": "s1_A9", "number": "A9", "type": "premium", "available": true, "row": 0, "col": 8},
                {"id": "s1_A10", "number": "A10", "type": "premium", "available": true, "row": 0, "col": 9},
                {"id": "s1_A11", "number": "A11", "type": "premium", "available": true, "row": 0, "col": 10},
                {"id": "s1_A12", "number": "A12", "type": "premium", "available": true, "row": 0, "col": 11}
              ],
              [
                {"id": "s1_B1", "number": "B1", "type": "standard", "available": true, "row": 1, "col": 0},
                {"id": "s1_B2", "number": "B2", "type": "standard", "available": true, "row": 1, "col": 1},
                {"id": "s1_B3", "number": "B3", "type": "standard", "available": true, "row": 1, "col": 2},
                {"id": "s1_B4", "number": "B4", "type": "standard", "available": true, "row": 1, "col": 3},
                {"id": "s1_B5", "number": "B5", "type": "standard", "available": true, "row": 1, "col": 4},
                {"id": "s1_B6", "number": "B6", "type": "standard", "available": true, "row": 1, "col": 5},
                {"id": "s1_B7", "number": "B7", "type": "standard", "available": true, "row": 1, "col": 6},
                {"id": "s1_B8", "number": "B8", "type": "standard", "available": true, "row": 1, "col": 7},
                {"id": "s1_B9", "number": "B9", "type": "standard", "available": true, "row": 1, "col": 8},
                {"id": "s1_B10", "number": "B10", "type": "standard", "available": true, "row": 1, "col": 9},
                {"id": "s1_B11", "number": "B11", "type": "standard", "available": true, "row": 1, "col": 10},
                {"id": "s1_B12", "number": "B12", "type": "standard", "available": true, "row": 1, "col": 11}
              ],
              [
                {"id": "s1_C1", "number": "C1", "type": "standard", "available": true, "row": 2, "col": 0},
                {"id": "s1_C2", "number": "C2", "type": "standard", "available": true, "row": 2, "col": 1},
                {"id": "s1_C3", "number": "C3", "type": "standard", "available": true, "row": 2, "col": 2},
                {"id": "s1_C4", "number": "C4", "type": "standard", "available": true, "row": 2, "col": 3},
                {"id": "s1_C5", "number": "C5", "type": "standard", "available": true, "row": 2, "col": 4},
                {"id": "s1_C6", "number": "C6", "type": "standard", "available": true, "row": 2, "col": 5},
                {"id": "s1_C7", "number": "C7", "type": "standard", "available": true, "row": 2, "col": 6},
                {"id": "s1_C8", "number": "C8", "type": "standard", "available": true, "row": 2, "col": 7},
                {"id": "s1_C9", "number": "C9", "type": "standard", "available": true, "row": 2, "col": 8},
                {"id": "s1_C10", "number": "C10", "type": "standard", "available": true, "row": 2, "col": 9},
                {"id": "s1_C11", "number": "C11", "type": "standard", "available": true, "row": 2, "col": 10},
                {"id": "s1_C12", "number": "C12", "type": "standard", "available": true, "row": 2, "col": 11}
              ],
              [
                {"id": "s1_D1", "number": "D1", "type": "standard", "available": true, "row": 3, "col": 0},
                {"id": "s1_D2", "number": "D2", "type": "standard", "available": true, "row": 3, "col": 1},
                {"id": "s1_D3", "number": "D3", "type": "standard", "available": true, "row": 3, "col": 2},
                {"id": "s1_D4", "number": "D4", "type": "standard", "available": true, "row": 3, "col": 3},
                {"id": "s1_D5", "number": "D5", "type": "standard", "available": true, "row": 3, "col": 4},
                {"id": "s1_D6", "number": "D6", "type": "standard", "available": true, "row": 3, "col": 5},
                {"id": "s1_D7", "number": "D7", "type": "standard", "available": true, "row": 3, "col": 6},
                {"id": "s1_D8", "number": "D8", "type": "standard", "available": true, "row": 3, "col": 7},
                {"id": "s1_D9", "number": "D9", "type": "standard", "available": true, "row": 3, "col": 8},
                {"id": "s1_D10", "number": "D10", "type": "standard", "available": true, "row": 3, "col": 9},
                {"id": "s1_D11", "number": "D11", "type": "standard", "available": true, "row": 3, "col": 10},
                {"id": "s1_D12", "number": "D12", "type": "standard", "available": true, "row": 3, "col": 11}
              ],
              [
              { "id": "s1_E1", "number": "E1", "type": "standard", "available": true, "row": 4, "col": 0 },
              { "id": "s1_E2", "number": "E2", "type": "standard", "available": true, "row": 4, "col": 1 },
              { "id": "s1_E3", "number": "E3", "type": "standard", "available": true, "row": 4, "col": 2 },
              { "id": "s1_E4", "number": "E4", "type": "standard", "available": true, "row": 4, "col": 3 },
              { "id": "s1_E5", "number": "E5", "type": "standard", "available": true, "row": 4, "col": 4 },
              { "id": "s1_E6", "number": "E6", "type": "standard", "available": true, "row": 4, "col": 5 },
              { "id": "s1_E7", "number": "E7", "type": "standard", "available": true, "row": 4, "col": 6 },
              { "id": "s1_E8", "number": "E8", "type": "standard", "available": true, "row": 4, "col": 7 },
              { "id": "s1_E9", "number": "E9", "type": "standard", "available": true, "row": 4, "col": 8 },
              { "id": "s1_E10", "number": "E10", "type": "standard", "available": true, "row": 4, "col": 9 },
              { "id": "s1_E11", "number": "E11", "type": "standard", "available": true, "row": 4, "col": 10 },
              { "id": "s1_E12", "number": "E12", "type": "standard", "available": true, "row": 4, "col": 11 },
              ],
              [
                { "id": "s1_F1", "number": "F1", "type": "standard", "available": true, "row": 5, "col": 0 },
                { "id": "s1_F2", "number": "F2", "type": "standard", "available": true, "row": 5, "col": 1 },
                { "id": "s1_F3", "number": "F3", "type": "standard", "available": true, "row": 5, "col": 2 },
                { "id": "s1_F4", "number": "F4", "type": "standard", "available": true, "row": 5, "col": 3 },
                { "id": "s1_F5", "number": "F5", "type": "standard", "available": true, "row": 5, "col": 4 },
                { "id": "s1_F6", "number": "F6", "type": "standard", "available": true, "row": 5, "col": 5 },
                { "id": "s1_F7", "number": "F7", "type": "standard", "available": true, "row": 5, "col": 6 },
                { "id": "s1_F8", "number": "F8", "type": "standard", "available": true, "row": 5, "col": 7 },
                { "id": "s1_F9", "number": "F9", "type": "standard", "available": true, "row": 5, "col": 8 },
                { "id": "s1_F10", "number": "F10", "type": "standard", "available": true, "row": 5, "col": 9 },
                { "id": "s1_F11", "number": "F11", "type": "standard", "available": true, "row": 5, "col": 10 },
                { "id": "s1_F12", "number": "F12", "type": "standard", "available": true, "row": 5, "col": 11 },

              ],
              [ { "id": "s1_G1", "number": "G1", "type": "standard", "available": true, "row": 6, "col": 0 },
                { "id": "s1_G2", "number": "G2", "type": "standard", "available": true, "row": 6, "col": 1 },
                { "id": "s1_G3", "number": "G3", "type": "standard", "available": true, "row": 6, "col": 2 },
                { "id": "s1_G4", "number": "G4", "type": "standard", "available": true, "row": 6, "col": 3 },
                { "id": "s1_G5", "number": "G5", "type": "standard", "available": true, "row": 6, "col": 4 },
                { "id": "s1_G6", "number": "G6", "type": "standard", "available": true, "row": 6, "col": 5 },
                { "id": "s1_G7", "number": "G7", "type": "standard", "available": true, "row": 6, "col": 6 },
                { "id": "s1_G8", "number": "G8", "type": "standard", "available": true, "row": 6, "col": 7 },
                { "id": "s1_G9", "number": "G9", "type": "standard", "available": true, "row": 6, "col": 8 },
                { "id": "s1_G10", "number": "G10", "type": "standard", "available": true, "row": 6, "col": 9 },
                { "id": "s1_G11", "number": "G11", "type": "standard", "available": true, "row": 6, "col": 10 },
                { "id": "s1_G12", "number": "G12", "type": "standard", "available": true, "row": 6, "col": 11 },
              ],
              [ { "id": "s1_H1", "number": "H1", "type": "standard", "available": true, "row": 7, "col": 0 },
                { "id": "s1_H2", "number": "H2", "type": "standard", "available": true, "row": 7, "col": 1 },
                { "id": "s1_H3", "number": "H3", "type": "standard", "available": true, "row": 7, "col": 2 },
                { "id": "s1_H4", "number": "H4", "type": "standard", "available": true, "row": 7, "col": 3 },
                { "id": "s1_H5", "number": "H5", "type": "standard", "available": true, "row": 7, "col": 4 },
                { "id": "s1_H6", "number": "H6", "type": "standard", "available": true, "row": 7, "col": 5 },
                { "id": "s1_H7", "number": "H7", "type": "standard", "available": true, "row": 7, "col": 6 },
                { "id": "s1_H8", "number": "H8", "type": "standard", "available": true, "row": 7, "col": 7 },
                { "id": "s1_H9", "number": "H9", "type": "standard", "available": true, "row": 7, "col": 8 },
                { "id": "s1_H10", "number": "H10", "type": "standard", "available": true, "row": 7, "col": 9 },
                { "id": "s1_H11", "number": "H11", "type": "standard", "available": true, "row": 7, "col": 10 },
                { "id": "s1_H12", "number": "H12", "type": "standard", "available": true, "row": 7, "col": 11 },
              ],
              [ { "id": "s1_I1", "number": "I1", "type": "standard", "available": true, "row": 8, "col": 0 },
                { "id": "s1_I2", "number": "I2", "type": "standard", "available": true, "row": 8, "col": 1 },
                { "id": "s1_I3", "number": "I3", "type": "standard", "available": true, "row": 8, "col": 2 },
                { "id": "s1_I4", "number": "I4", "type": "standard", "available": true, "row": 8, "col": 3 },
                { "id": "s1_I5", "number": "I5", "type": "standard", "available": true, "row": 8, "col": 4 },
                { "id": "s1_I6", "number": "I6", "type": "standard", "available": true, "row": 8, "col": 5 },
                { "id": "s1_I7", "number": "I7", "type": "standard", "available": true, "row": 8, "col": 6 },
                { "id": "s1_I8", "number": "I8", "type": "standard", "available": true, "row": 8, "col": 7 },
                { "id": "s1_I9", "number": "I9", "type": "standard", "available": true, "row": 8, "col": 8 },
                { "id": "s1_I10", "number": "I10", "type": "standard", "available": true, "row": 8, "col": 9 },
                { "id": "s1_I11", "number": "I11", "type": "standard", "available": true, "row": 8, "col": 10 },
                { "id": "s1_I12", "number": "I12", "type": "standard", "available": true, "row": 8, "col": 11 },
              ],
              [ { "id": "s1_J1", "number": "J1", "type": "standard", "available": true, "row": 9, "col": 0 },
                { "id": "s1_J2", "number": "J2", "type": "standard", "available": true, "row": 9, "col": 1 },
                { "id": "s1_J3", "number": "J3", "type": "standard", "available": true, "row": 9, "col": 2 },
                { "id": "s1_J4", "number": "J4", "type": "standard", "available": true, "row": 9, "col": 3 },
                { "id": "s1_J5", "number": "J5", "type": "standard", "available": true, "row": 9, "col": 4 },
                { "id": "s1_J6", "number": "J6", "type": "standard", "available": true, "row": 9, "col": 5 },
                { "id": "s1_J7", "number": "J7", "type": "standard", "available": true, "row": 9, "col": 6 },
                { "id": "s1_J8", "number": "J8", "type": "standard", "available": true, "row": 9, "col": 7 },
                { "id": "s1_J9", "number": "J9", "type": "standard", "available": true, "row": 9, "col": 8 },
                { "id": "s1_J10", "number": "J10", "type": "standard", "available": true, "row": 9, "col": 9 },
                { "id": "s1_J11", "number": "J11", "type": "standard", "available": true, "row": 9, "col": 10 },
                { "id": "s1_J12", "number": "J12", "type": "standard", "available": true, "row": 9, "col": 11 }
              ],
            ]
        }
        
    ]
    

    const screenResponses: AxiosResponse[] = await Promise.all(screenData.map(d => api.post('/screens', d)));
    const screenIds = screenResponses.map(res => res.data.id); 
    
    console.log("✅ screens seeded successfully.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error seeding screens:", error.message);
    } else {
      console.error("❌ Unknown error seeding screens:", error);
    }
  }
})();
