
import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

(async () => {
  try {
    const movieData = [
        {
            id: "m1",
            title: "The Last Adventure",
            description: "A thrilling journey through uncharted territories as a group of explorers discover a hidden world with secrets beyond imagination.",
            year: "2023",
            genre: ["Adventure"],
            rating: "8.7",
            duration: "142",
            directorId: "d1",
            cast: [
            {
            castMemberId: "c2",
            character: "Barbie"
            },
            {
            castMemberId: "c3",
            character: "Ken"
            }
  ],
            image: "https://m.media-amazon.com/images/M/MV5BOGFiNTQzYzAtNTg0MC00NzM1LThiNGMtOGU2NWQyMjkwYmE1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            status: "now_showing",
            hidden: false,
            trailer:"https://youtu.be/yDsMZn3olFw?feature=shared"
        
          },
          {
            id: "m2",
            title: "Midnight Mystery",
            description: "A detective must solve a complex murder case before midnight, or risk becoming the next victim in this suspenseful thriller.",
            year: "2023",
            genre: ["Thriller"],
            rating: "9.1",
            duration: "128",
            directorId: "d2",
            cast: [{castMemberId:"c7"}, {castMemberId:"c8"}, {castMemberId:"c9"}, {castMemberId:"c6"},{castMemberId:"c1"},{castMemberId:"c5"}],
            image: "https://m.media-amazon.com/images/M/MV5BNTNlM2Q0YjQtMTczMy00MWY2LTlhMmEtZDY4YzYxNmI5ZDNkXkEyXkFqcGc@._V1_.jpg",
            status: "now_showing",
            hidden: false,
            trailer:"https://youtu.be/yDsMZn3olFw?feature=shared"
        
          },
          {
            id: "m3",
            title: "Eternal Echoes",
            description: "A love story that transcends time and space, following two souls who find each other in different lifetimes.",
            year: "2022",
            genre: ["Romance"],
            rating: "8.5",
            duration: "135",
            directorId: "d2",
            cast: [{castMemberId:"c7"}, {castMemberId:"c8"}, {castMemberId:"c9"}, {castMemberId:"c6"}],
            image: "https://m.media-amazon.com/images/M/MV5BNzgwNDdmMjQtZWUwOS00ZDM2LTgzNGUtNWUwZDczMWRhMGM3XkEyXkFqcGc@._V1_.jpg",
            status: "now_showing",
            hidden: false,
            trailer:"https://youtu.be/yDsMZn3olFw?feature=shared"
          },
          {
            id: "m4",
            title: "Quantum Horizon",
            description: "When a quantum experiment goes wrong, scientists must navigate multiple realities to find their way back home.",
            year: "2023",
            genre: ["SciFi"],
            rating: "8.9",
            duration: "150",
            directorId: "d2",
            cast: [{castMemberId:"c7"}, {castMemberId:"c8"}, {castMemberId:"c9"}, {castMemberId:"c6"}],
            image: "https://cosmicchemist.com/wp-content/uploads/2018/09/51wwdpszual.jpg?w=640",
            status: "coming_soon",
            hidden: false,
            trailer:"https://youtu.be/yDsMZn3olFw?feature=shared"
          },
          {
            id: "m5",
            title: "The Last Laugh",
            description: "A struggling comedian finds unexpected success when his dark humor resonates with audiences, but at what cost?",
            year: "2022",
            genre: ["Comedy","Drama"],
            rating: "8.3",
            duration: "118",
            directorId: "d2",
            cast: [{castMemberId:"c7"}, {castMemberId:"c8"}],
            image: "https://m.media-amazon.com/images/M/MV5BMjdjOGE0MTEtMTAyOC00OTE2LTk0M2YtMWYwMTViNmQ0ZGU3XkEyXkFqcGc@._V1_.jpg",
            status: "coming_soon",
            hidden: false,
            trailer:"https://youtu.be/yDsMZn3olFw?feature=shared"
          },
          {
            id: "m6",
            title: "Shadow Empire",
            description: "In a dystopian future, a resistance fighter uncovers a conspiracy that could either save humanity or doom it forever.",
            year: "2023",
            genre: ["Action"],
            rating: "8.6",
            duration: "155",
            directorId: "d2",
            cast: [ {castMemberId:"c9"}, {castMemberId:"c6"}],
            image: "https://m.media-amazon.com/images/M/MV5BNWFjMmI4MDItYTJhMC00MWE5LTlhZTUtZTExMDk3MTAyZTdlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            status: "coming_soon",
            hidden: false,
            trailer:"https://youtu.be/yDsMZn3olFw?feature=shared"
          },
          {
            id: "m7",
            title: "Whispers in the Wind",
            description: "A family moves to a remote farmhouse only to discover that the land holds ancient secrets and supernatural forces.",
            year: "2022",
            genre: ["Horror"],
            rating: "7.9",
            duration: "110",
            directorId: "d2",
            cast: [{castMemberId:"c7"}, {castMemberId:"c9"}],
            image: "https://m.media-amazon.com/images/M/MV5BNTM2ZWUyOWQtOGVkYS00OWZlLTljOGMtYWI3Yzg2YjEyNjEzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            status: "now_showing",
            hidden: true,
            trailer:"https://youtu.be/yDsMZn3olFw?feature=shared"
          },
          {
            id: "m8",
            title: "Beyond the Horizon",
            description: "An astronaut stranded on a distant planet must use her ingenuity to survive and find a way back to Earth.",
            year: "2021",
            genre: ["SciFi"],
            rating: "8.8",
            duration: "140",
            directorId: "d2",
            cast: [{castMemberId:"c7"}, {castMemberId:"c8"}],
            image: "https://m.media-amazon.com/images/M/MV5BZjk1OWNlYjAtZGI3OS00YjQxLThkMzItYzhjMjY2OGVhNDViXkEyXkFqcGc@._V1_.jpg",
            status: "now_showing",
            hidden: false,
            trailer:"https://youtu.be/yDsMZn3olFw?feature=shared"
          },
          {
            id: "m9",
            title: "The Grand Illusion",
            description: "A master magician's greatest trick becomes real, blurring the lines between illusion and reality.",
            year: "2022",
            genre: ["Mystery"],
            rating: "8.4",
            duration: "125",
            directorId: "d2",
            cast: [{castMemberId:"c7"}],
            image: "https://m.media-amazon.com/images/I/81g5BYxQBOL._AC_UF894,1000_QL80_.jpg",
            status: "coming_soon",
            hidden: false,
            trailer:"https://youtu.be/yDsMZn3olFw?feature=shared"
          },
          {
            id: "m10",
            title: "Echoes of Tomorrow",
            description: "A brilliant scientist creates an AI that can predict the future, but soon discovers some futures are better left unknown.",
            year: "2023",
            genre: ["SciFi","Thriller"],
            rating: "9.0",
            duration: "138",
            directorId: "d2",
            cast: [{castMemberId:"c8"}, {castMemberId:"c3"}],
            image: "https://m.media-amazon.com/images/M/MV5BZmVhYzJlNDYtNzlhZS00MmM5LWE5ODEtZjgwMTViZTRiYTY0XkEyXkFqcGc@._V1_.jpg",
            status: "coming_soon",
            hidden: false,
            trailer:"https://youtu.be/yDsMZn3olFw?feature=shared" 
          },
    ];

    const movieResponses: AxiosResponse[] = await Promise.all(movieData.map(m => api.post('/movies', m)));
    const movieIds = movieResponses.map(res => res.data.id); // Assuming response has `id`

    console.log("✅ Movies seeded successfully.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error seeding movies:", error.message);
    } else {
      console.error("❌ Unknown error seeding movies:", error);
    }
  }
})();
