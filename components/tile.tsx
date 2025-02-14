import Link from "next/link"
import { cn } from "@/lib/utils"

export type TileColor = 
  | "blue"   // default
  | "green"  // for success/active
  | "red"    // for critical/urgent
  | "yellow" // for warning/in-progress
  | "purple" // for special features
  | "gray"   // for disabled/inactive
  | "indigo" // for platform
  | "teal"   // for tools

export interface TileData {
  title: string
  href: string
  disabled?: boolean
  openInNewTab?: boolean
  color?: TileColor
}

const colorVariants: Record<TileColor, string> = {
  blue: "bg-blue-500 hover:bg-blue-600",
  green: "bg-green-500 hover:bg-green-600",
  red: "bg-red-500 hover:bg-red-600",
  yellow: "bg-yellow-500 hover:bg-yellow-600",
  purple: "bg-purple-500 hover:bg-purple-600",
  gray: "bg-gray-500 hover:bg-gray-600",
  indigo: "bg-indigo-500 hover:bg-indigo-600",
  teal: "bg-teal-500 hover:bg-teal-600"
}

export function Tile({ 
  title, 
  href, 
  disabled = false, 
  openInNewTab = true,
  color = "blue" 
}: TileData) {
  const content = (
    <div
      className={cn(
        "block p-6 rounded-lg text-center transition-colors text-white",
        disabled ? "bg-gray-300 cursor-not-allowed" : colorVariants[color]
      )}
    >
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  )

  if (disabled) {
    return content
  }

  return (
    <Link 
      href={href}
      target={openInNewTab ? "_blank" : "_self"}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
    >
      {content}
    </Link>
  )
}

