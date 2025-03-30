"use client"
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { CastMember } from '@/types/types';
import MovieCard from '@/components/movie-card';


const testCastData: CastMember[] = [{
    "id": "c1",
    "name": "Leonardo DiCaprio",
    "image": "https://ucarecdn.com/86025dd5-4ede-4c11-9750-3532f466af68/-/format/auto/-/preview/3000x3000/-/quality/lighter/shutterstock_1433831474.jpg",
    "character": "Dom Cobb",
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
            "releaseDate": '', // or a valid date string if available
            "status": "now_showing",
            "hidden": false,
            "trailer": "",
            'castIds': []
        }
    ]
}];

export default function CastPage() {
    const params = useParams();
    const id = Array.isArray(params) ? params[0] : ''
    const cast = testCastData[0];

    if (!cast) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-xl">Cast not found</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 mt-20">
            {/* Cast Section */}
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold">Actor</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div>
                        <Image
                            src={cast.image}
                            alt={cast.name}
                            width={200}
                            height={300}
                            className="rounded-lg object-cover border-2 border-gray-200 dark:border-gray-700 transition-all shadow-md"
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                            {cast.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Character: {cast.character}
                        </p>
                    </div>
                </div>
            </div>

            {/* Movies Section */}
            <h2 className="text-2xl font-semibold mt-6">More Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                {cast.movies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}
