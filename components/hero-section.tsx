import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative h-screen min-h-[800px] flex items-center overflow-hidden">
      {/* Background with parallax effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img
          src="https://mutantreviewersmovies.com/wp-content/uploads/2023/11/posterheader.jpg?w=723&h=301"
          alt="Movie backdrop"
          className="w-full h-full object-cover scale-110 animate-zoom-in"
        />
        {/* Animated floating elements */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-red-500/20 animate-float-1"></div>
        <div className="absolute top-1/3 right-1/3 w-12 h-12 rounded-full bg-blue-500/20 animate-float-2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-10 h-10 rounded-full bg-yellow-500/20 animate-float-3"></div>
      </div>

      {/* Content with glass morphism effect */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 max-w-3xl shadow-2xl animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            Experience <span className="text-white">Movies</span> Like Never Before
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 font-medium">
            Immerse yourself in the ultimate cinema experience with state-of-the-art sound, crystal clear projection,
            and premium comfort.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link 
              href="/movies" 
              className="relative overflow-hidden group bg-gradient-to-br from-red-600 to-red-800 text-white py-4 px-8 rounded-xl transition-all duration-500 hover:shadow-lg hover:shadow-red-500/30"
            >
              <span className="relative z-10 flex items-center justify-center">
                Book Tickets Now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            
            <button className="relative overflow-hidden group bg-transparent border-2 border-white/20 text-white py-4 px-8 rounded-xl transition-all duration-500 hover:bg-white/10 hover:border-white/40">
              <span className="relative z-10 flex items-center">
                <svg
                  className="w-6 h-6 mr-3"
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
              </span>
              <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Scrolling indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-8 h-14 rounded-3xl border-2 border-white/50 flex justify-center p-1">
          <div className="w-2 h-2 rounded-full bg-white mt-1"></div>
        </div>
      </div>

      {/* Animated stars */}
      {[...Array(20)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random(),
            animationDelay: `${Math.random() * 5}s`
          }}
        ></div>
      ))}
    </section>
  );
}