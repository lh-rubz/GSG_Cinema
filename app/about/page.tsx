import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | CineHub",
  description: "Learn about CineHub and our mission to provide the ultimate cinema experience",
}

export default function AboutPage() {
  return (
    <main className="py-10 px-3 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              About <span className="text-red-600">CineHub</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Where stories come to life and memories are made
            </p>
          </div>

          <div className="space-y-12">
            {/* Our Story */}
            <section className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-2 bg-red-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Story</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Founded in 2010, CineHub began with a simple mission: to create an extraordinary cinema experience that
                goes beyond just watching a movie. What started as a single screen in downtown has now grown into a
                nationwide chain of premium theaters, each designed to immerse viewers in the magic of cinema.
              </p>
            </section>

            {/* Our Mission */}
            <section className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-2 bg-red-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                At CineHub, we believe that movies are meant to be experienced, not just watched. Our mission is to
                provide state-of-the-art facilities, cutting-edge technology, and exceptional service that transforms
                movie-going into an unforgettable event.
              </p>
            </section>

            {/* The CineHub Experience */}
            <section className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-2 bg-red-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">The CineHub Experience</h2>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2">
                <div className="flex flex-col gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                      <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Premium Comfort</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Luxury reclining seats, spacious legroom, and perfect sightlines ensure maximum comfort throughout your experience.
                  </p>
                </div>

                <div className="flex flex-col gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                      <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Cutting-Edge Technology</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    4K laser projection, Dolby Atmos, and IMAX deliver unparalleled audiovisual quality.
                  </p>
                </div>

                <div className="flex flex-col gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                      <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Gourmet Concessions</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    A curated selection of gourmet food and beverages, including craft cocktails and chef-prepared meals.
                  </p>
                </div>

                <div className="flex flex-col gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                      <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Community Focus</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Supporting local communities through special events, partnerships, and educational programs.
                  </p>
                </div>
              </div>
            </section>

            {/* Our Values */}
            <section className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-2 bg-red-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Values</h2>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "Innovation", desc: "Constantly enhancing the cinema experience" },
                  { name: "Quality", desc: "Highest standards in every aspect" },
                  { name: "Inclusivity", desc: "Welcoming spaces for all" },
                  { name: "Sustainability", desc: "Eco-friendly practices" },
                  { name: "Community", desc: "Supporting local initiatives" },
                  { name: "Passion", desc: "For the art of filmmaking" },
                ].map((value) => (
                  <div key={value.name} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">{value.name}</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">{value.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Leadership Team */}
            <section className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-2 bg-red-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leadership Team</h2>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { name: "Sarah Johnson", role: "Chief Executive Officer" },
                  { name: "Michael Chen", role: "Chief Operations Officer" },
                  { name: "David Rodriguez", role: "Chief Technology Officer" },
                  { name: "Emily Williams", role: "Chief Marketing Officer" },
                ].map((member) => (
                  <div key={member.name} className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                        <span className="text-red-600 dark:text-red-300 font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}