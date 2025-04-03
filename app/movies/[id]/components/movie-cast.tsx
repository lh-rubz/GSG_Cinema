import { CastMember } from "@/types/types"
import { EyeIcon } from "lucide-react"
import Link from 'next/link'

export function MovieCast({ cast }: { cast: CastMember[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {cast.map((member) => (
      <Link key={member.id} href={`/cast/${member.id}`} className="flex flex-col items-center group">
      <div className="relative mb-3">
        <img
          src={member.image}
          alt={member.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 group-hover:border-red-500 transition-all"
        />
        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
          <EyeIcon className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <h3 className="font-medium text-center dark:text-white">{member.name}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {member.character}
      </p>
    </Link>
      ))}
    </div>
  )
}