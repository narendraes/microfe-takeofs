import Link from "next/link"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

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
  href: string  // Only href is required
  id?: string   // Category ID
  title?: string
  description?: string
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
  description,
  href, 
  id,
  disabled = false, 
  openInNewTab = false,
  color = "blue" 
}: TileData) {
  const [tileData, setTileData] = useState<{
    title: string;
    description?: string;
    color: TileColor;
    isLoading: boolean;
  }>({
    title: title || "Loading...",
    description,
    color: color as TileColor,
    isLoading: !title // If title is not provided, we need to fetch data
  });

  // Extract category ID from href if not provided
  const categoryId = id || href.split('/').pop();

  // Fetch category data if title is not provided
  useEffect(() => {
    if (!tileData.isLoading) return;

    const fetchCategoryData = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}/data`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch category data: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        setTileData({
          title: data.title,
          description: data.description,
          color: data.color as TileColor,
          isLoading: false
        });
      } catch (error) {
        console.error(`Error fetching data for category ${categoryId}:`, error);
        setTileData({
          title: categoryId || "Unknown",
          color: "gray",
          isLoading: false
        });
      }
    };

    fetchCategoryData();
  }, [categoryId, tileData.isLoading]);

  const content = (
    <div
      className={cn(
        "block p-6 rounded-lg text-center transition-colors text-white relative group h-24 flex items-center justify-center",
        tileData.isLoading ? "bg-gray-300 animate-pulse" : 
        disabled ? "bg-gray-300 cursor-not-allowed" : colorVariants[tileData.color]
      )}
    >
      <h2 className="text-xl font-semibold truncate max-w-full">
        {tileData.title}
      </h2>
      
      {/* Popup tooltip that appears on hover */}
      {tileData.description && !tileData.isLoading && (
        <div className="invisible group-hover:visible absolute z-50 w-64 p-4 bg-white text-gray-800 dark:bg-gray-800 dark:text-white rounded-lg shadow-lg transition-all duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2">
          <h3 className="text-lg font-semibold mb-2">{tileData.title}</h3>
          <p className="text-sm">{tileData.description}</p>
          <div className="absolute w-3 h-3 bg-white dark:bg-gray-800 transform rotate-45 top-full left-1/2 -translate-x-1/2 -mt-1.5"></div>
        </div>
      )}
    </div>
  )

  if (disabled || tileData.isLoading) {
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

