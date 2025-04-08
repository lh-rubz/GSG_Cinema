import { Director } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

(async () => {
  try {
    const directorData: Director[] = [
      {id: "d1", name: "Christopher Nolan", bio: "Christopher Edward Nolan is a British-American filmmaker...", image: "https://cdn.britannica.com/37/255737-050-9BB3FEDA/Christopher-Nolan-Movie-film-director-Oppenheimer-UK-premiere-2023.jpg" },
      {id: "d2", name: "Denis Villeneuve", bio: "Denis Villeneuve is a Canadian filmmaker...", image: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Denis_Villeneuve_by_Gage_Skidmore.jpg" },
      {id: "d3", name: "Greta Gerwig", bio: "Greta Celeste Gerwig is an American actress and filmmaker. She has received nominations for the Academy Award for Best Director, Best Original Screenplay, and Best Adapted Screenplay.", image: "https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/greta_gerwig_6.jpg" }
    ];

    const directorResponses: AxiosResponse[] = await Promise.all(directorData.map(d => api.post('/directors', d)));
    const directorIds = directorResponses.map(res => res.data.id); 
    
    console.log("✅ Directors seeded successfully.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error seeding directors:", error.message);
    } else {
      console.error("❌ Unknown error seeding directors:", error);
    }
  }
})();
