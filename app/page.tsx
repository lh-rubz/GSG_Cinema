import Link from "next/link"


import { movies } from "@/data/movies"

export default function Home() {
  const featuredMovies = movies.slice(0, 4)

  return (
    <>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
      <div className="absolute inset-0 z-0">
  <img
    src="https://cdn.celluloidjunkie.com/wp-content/uploads/2021/04/30144535/Paper-vs-Digital-Movie-Posters-Featured.jpg"
    alt="Movie backdrop"
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-gray-700 opacity-50"></div> {/* Light gray transparent overlay */}
  <div className="absolute inset-0 hero-gradient"></div>
</div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-white mb-4">Experience Movies Like Never Before</h1>
            <p className="text-xl text-gray-300 mb-8">
              Immerse yourself in the ultimate cinema experience with state-of-the-art sound, crystal clear projection,
              and premium comfort.
            </p>
            <div className="flex flex-wrap gap-4">
            <Link href="/movies" className="primary-button bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-red-700">
  Book Tickets Now
</Link>

<button className="secondary-button flex items-center bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-gray-700">
  <svg
    className="w-5 h-5 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
  Watch Trailer
</button>

            </div>
          </div>
        </div>
      </section>

      {/* Now Showing Section */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Now Showing</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Catch the latest blockbusters on the big screen</p>
            </div>
            <Link href="/movies" className="text-red-600 hover:text-red-500 font-medium flex items-center">
              View All Movies
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={
                      movie.image || `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(movie.title)}`
                    }
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="rating-badge">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {movie.rating}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{movie.title}</h3>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>{movie.year}</span>
                    <span>{movie.genre}</span>
                  </div>
                  <Link
                    href={`/movies/${movie.id}`}
                    className="block w-full py-2 bg-red-600 hover:bg-red-700 text-white text-center font-medium rounded"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore by Genre Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Explore Movies by Genre</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover the perfect movie for your mood from our extensive collection
            </p>
          </div>

          <div className="flex justify-center space-x-2 mb-10 overflow-x-auto pb-2">
            <button className="genre-tab active">Action</button>
            <button className="genre-tab">Comedy</button>
            <button className="genre-tab">Drama</button>
            <button className="genre-tab">Sci-Fi</button>
            <button className="genre-tab">Horror</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.slice(4, 8).map((movie) => (
              <div
                key={movie.id}
                className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={
                      movie.image || `/placeholder.svg?height=450&width=300&text=${encodeURIComponent(movie.title)}`
                    }
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="rating-badge">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {movie.rating}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{movie.title}</h3>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>{movie.year}</span>
                    <span>{movie.genre}</span>
                  </div>
                  <Link
                    href={`/movies/${movie.id}`}
                    className="block w-full py-2 bg-red-600 hover:bg-red-700 text-white text-center font-medium rounded"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/movies"
              className="inline-block py-3 px-6 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded"
            >
              View All Movies
            </Link>
          </div>
        </div>
      </section>

      {/* Cinema Features Section */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Our Cinema Features</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Experience the best in movie entertainment with our state-of-the-art facilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">4K Projection</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Crystal clear images with vibrant colors and incredible detail on our massive screens
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828-2.828"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Dolby Atmos Sound</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Immersive audio experience that places sounds all around you for ultimate realism
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Luxury Seating</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Plush reclining seats with extra legroom for maximum comfort during your movie
              </p>
            </div>
          </div>
        </div>
      </section>

   
    </>
  )
}

