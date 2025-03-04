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
  description?: string
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

// Helper function to truncate text with ellipsis
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export function Tile({ 
  title, 
  description,
  href, 
  disabled = false, 
  openInNewTab = false,
  color = "blue" 
}: TileData) {
  const content = (
    <div
      className={cn(
        "block p-6 rounded-lg text-center transition-colors text-white h-32 flex flex-col justify-center",
        disabled ? "bg-gray-300 cursor-not-allowed" : colorVariants[color]
      )}
      title={title} // Show full title on hover
    >
      <h2 className="text-xl font-semibold mb-1 overflow-hidden text-ellipsis whitespace-nowrap">{title}</h2>
      {description && (
        <p className="text-sm overflow-hidden" style={{ 
          display: '-webkit-box', 
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical' 
        }}>
          {description}
        </p>
      )}
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
      className="h-full"
    >
      {content}
    </Link>
  )
}

