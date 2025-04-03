interface MovieTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  movieStatus: "now_showing" | "coming_soon"
}

export function MovieTabs({ activeTab, setActiveTab, movieStatus }: MovieTabsProps) {
  const tabs = movieStatus === "now_showing" 
    ? ["info", "showtimes", "reviews"]
    : ["info"]

  return (
    <div className="sticky top-0 z-10 bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-red-600 text-red-600 dark:text-red-400"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}