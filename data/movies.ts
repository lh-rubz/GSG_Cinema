import { Movie } from "@/types/movie";

export const movies: Movie[] = [
  {
    id: 1,
    title: "The Last Adventure",
    description:
      "A thrilling journey through uncharted territories as a group of explorers discover a hidden world with secrets beyond imagination.",
    year: 2023,
    genre: "Adventure",
    rating: 8.7,
    duration: 142,
    director: "Christopher Johnson",
    cast: ["Emma Stone", "Tom Hardy", "Michael B. Jordan", "Zoe Saldana"],
    image: "https://medias.unifrance.org/medias/17/148/103441/format_page/the-last-adventure.png",  // Example image URL
  },
  {
    id: 2,
    title: "Midnight Mystery",
    description:
      "A detective must solve a complex murder case before midnight, or risk becoming the next victim in this suspenseful thriller.",
    year: 2023,
    genre: "Thriller",
    rating: 9.1,
    duration: 128,
    director: "David Fincher",
    cast: ["Cillian Murphy", "Ana de Armas", "Denzel Washington", "Florence Pugh"],
    image: "https://m.media-amazon.com/images/M/MV5BNTNlM2Q0YjQtMTczMy00MWY2LTlhMmEtZDY4YzYxNmI5ZDNkXkEyXkFqcGc@._V1_.jpg",  // Example image URL
  },
  {
    id: 3,
    title: "Eternal Echoes",
    description:
      "A love story that transcends time and space, following two souls who find each other in different lifetimes.",
    year: 2022,
    genre: "Romance",
    rating: 8.5,
    duration: 135,
    director: "Sofia Coppola",
    cast: ["Timothée Chalamet", "Saoirse Ronan", "Daniel Kaluuya", "Zendaya"],
    image: "https://m.media-amazon.com/images/M/MV5BNzgwNDdmMjQtZWUwOS00ZDM2LTgzNGUtNWUwZDczMWRhMGM3XkEyXkFqcGc@._V1_.jpg",  // Example image URL
  },
  {
    id: 4,
    title: "Quantum Horizon",
    description:
      "When a quantum experiment goes wrong, scientists must navigate multiple realities to find their way back home.",
    year: 2023,
    genre: "Sci-Fi",
    rating: 8.9,
    duration: 150,
    director: "Denis Villeneuve",
    cast: ["Ryan Gosling", "Lupita Nyong'o", "Oscar Isaac", "Jodie Comer"],
    image: "https://cosmicchemist.com/wp-content/uploads/2018/09/51wwdpszual.jpg?w=640",  // Example image URL
  },
  {
    id: 5,
    title: "The Last Laugh",
    description:
      "A struggling comedian finds unexpected success when his dark humor resonates with audiences, but at what cost?",
    year: 2022,
    genre: "Comedy/Drama",
    rating: 8.3,
    duration: 118,
    director: "Greta Gerwig",
    cast: ["Joaquin Phoenix", "Awkwafina", "Bill Murray", "Tilda Swinton"],
    image: "https://m.media-amazon.com/images/M/MV5BMjdjOGE0MTEtMTAyOC00OTE2LTk0M2YtMWYwMTViNmQ0ZGU3XkEyXkFqcGc@._V1_.jpg",  // Example image URL
  },
  {
    id: 6,
    title: "Shadow Empire",
    description:
      "In a dystopian future, a resistance fighter uncovers a conspiracy that could either save humanity or doom it forever.",
    year: 2023,
    genre: "Action",
    rating: 8.6,
    duration: 155,
    director: "Kathryn Bigelow",
    cast: ["John Boyega", "Charlize Theron", "Idris Elba", "Brie Larson"],
    image: "https://m.media-amazon.com/images/M/MV5BNWFjMmI4MDItYTJhMC00MWE5LTlhZTUtZTExMDk3MTAyZTdlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",  // Example image URL
  },
  {
    id: 7,
    title: "Whispers in the Wind",
    description:
      "A family moves to a remote farmhouse only to discover that the land holds ancient secrets and supernatural forces.",
    year: 2022,
    genre: "Horror",
    rating: 7.9,
    duration: 110,
    director: "Jordan Peele",
    cast: ["Elisabeth Moss", "Dev Patel", "Toni Collette", "LaKeith Stanfield"],
    image: "https://m.media-amazon.com/images/M/MV5BNTM2ZWUyOWQtOGVkYS00OWZlLTljOGMtYWI3Yzg2YjEyNjEzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",  // Example image URL
  },
  {
    id: 8,
    title: "Beyond the Horizon",
    description:
      "An astronaut stranded on a distant planet must use her ingenuity to survive and find a way back to Earth.",
    year: 2021,
    genre: "Sci-Fi",
    rating: 8.8,
    duration: 140,
    director: "Alfonso Cuarón",
    cast: ["Jessica Chastain", "Pedro Pascal", "John David Washington", "Karen Gillan"],
    image: "https://m.media-amazon.com/images/M/MV5BZjk1OWNlYjAtZGI3OS00YjQxLThkMzItYzhjMjY2OGVhNDViXkEyXkFqcGc@._V1_.jpg",  // Example image URL
  },
  {
    id: 9,
    title: "The Grand Illusion",
    description: "A master magician's greatest trick becomes real, blurring the lines between illusion and reality.",
    year: 2022,
    genre: "Mystery",
    rating: 8.4,
    duration: 125,
    director: "Christopher Nolan",
    cast: ["Benedict Cumberbatch", "Rebecca Ferguson", "Robert Pattinson", "Léa Seydoux"],
    image: "https://m.media-amazon.com/images/I/81g5BYxQBOL._AC_UF894,1000_QL80_.jpg",  // Example image URL
  },
  {
    id: 10,
    title: "Echoes of Tomorrow",
    description:
      "A brilliant scientist creates an AI that can predict the future, but soon discovers some futures are better left unknown.",
    year: 2023,
    genre: "Sci-Fi/Thriller",
    rating: 9.0,
    duration: 138,
    director: "Alex Garland",
    cast: ["Alicia Vikander", "Oscar Isaac", "Domhnall Gleeson", "Sonoya Mizuno"],
    image: "https://m.media-amazon.com/images/M/MV5BZmVhYzJlNDYtNzlhZS00MmM5LWE5ODEtZjgwMTViZTRiYTY0XkEyXkFqcGc@._V1_.jpg",  // Example image URL
  },
];
