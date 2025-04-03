"use client"
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Director } from '@/types/types';
import MovieCard from '@/components/movie-card';

const testData: Director[] = [{
    "id": "d1",
    "name": "Christopher Nolan",
    "bio": "British-American filmmaker known for his cerebral, often nonlinear storytelling.",
    "image": "https://m.media-amazon.com/images/M/MV5BNjE3NDQyOTYyMV5BMl5BanBnXkFtZTcwODcyODU2Mw@@._V1_FMjpg_UX1000_.jpg",
    "movies": [
        {
            "id": "m1",
            "title": "The Last Adventure",
            "year": "2023",
            "genre": ["Adventure"],
            "rating": "8.7",
            "description": "A thrilling journey through uncharted territories as a group of explorers discover a hidden world with secrets beyond imagination.",
            "image": "https://medias.unifrance.org/medias/17/148/103441/format_page/the-last-adventure.png",
            "directorId": "d1",
            "duration": "142",
            "releaseDate": '',
            "status": "now_showing",
            "hidden": false,
            "trailer": '',
            "castIds": []
        },
        {
            "id": "m2",
            "title": "The Last Adventure",
            "year": "2023",
            "genre": ["Adventure"],
            "rating": "8.7",
            "description": "A thrilling journey through uncharted territories as a group of explorers discover a hidden world with secrets beyond imagination.",
            "image": "https://medias.unifrance.org/medias/17/148/103441/format_page/the-last-adventure.png",
            "directorId": "d1",
            "duration": "142",
            "releaseDate": '',
            "status": "now_showing",
            "hidden": false,
            "trailer": '',
            "castIds": []
        },
        {
            "id": "m2",
            "title": "The Last Adventure",
            "year": "2023",
            "genre": ["Adventure"],
            "rating": "8.7",
            "description": "A thrilling journey through uncharted territories as a group of explorers discover a hidden world with secrets beyond imagination.",
            "image": "https://medias.unifrance.org/medias/17/148/103441/format_page/the-last-adventure.png",
            "directorId": "d1",
            "duration": "142",
            "releaseDate": '',
            "status": "now_showing",
            "hidden": false,
            "trailer": '',
            "castIds": []
        },
        {
            "id": "m2",
            "title": "The Last Adventure",
            "year": "2023",
            "genre": ["Adventure"],
            "rating": "8.7",
            "description": "A thrilling journey through uncharted territories as a group of explorers discover a hidden world with secrets beyond imagination.",
            "image": "https://medias.unifrance.org/medias/17/148/103441/format_page/the-last-adventure.png",
            "directorId": "d1",
            "duration": "142",
            "releaseDate": '',
            "status": "now_showing",
            "hidden": false,
            "trailer": '',
            "castIds": []
        },
    ]
}];

export default function DirectorPage() {
    const params = useParams();
    const id = Array.isArray(params) ? params[0] : ''
    const director = testData[0];

    if (!director) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-xl">
                    Director not found
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 mt-20">
            {/* Director Section */}
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold">Director</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div>
                        <Image 
                            src={director.image}
                            alt={director.name}
                            width={200} 
                            height={300} 
                            className="rounded-lg object-cover border-2 border-gray-200 dark:border-gray-700 transition-all shadow-md"
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                            {director.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                            {director.bio}
                        </p>
                    </div>
                </div>
            </div>

            {/* Movies Section */}
            <h2 className="text-2xl font-semibold mt-6">Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                {director.movies.map(movie => (
                    <MovieCard key={movie.id} movie={movie}/>
                ))}
            </div>
        </div>
    );
}
