'use client'

import { useState, useEffect } from 'react'
import { Tile, type TileData } from "./tile"

// Default tiles as fallback
const defaultTiles: TileData[] = [
  { title: "Bank", href: "/tickets/bank", color: "blue", openInNewTab: false },
  { title: "Directed Pay", href: "/tickets/directed-pay", color: "green", openInNewTab: false },
  { title: "SSO/API", href: "/tickets/sso-api", color: "purple", openInNewTab: false },
  { title: "Commercial Pay", href: "/tickets/commercial-pay", color: "indigo", openInNewTab: false },
  { title: "Commercial Provider", href: "/tickets/commercial-provider", color: "teal", openInNewTab: false },
  { title: "Data Engineering", href: "/tickets/data-engineering", color: "yellow", openInNewTab: false },
  { title: "HBA", href: "/tickets/hba", color: "blue", openInNewTab: false },
  { title: "CAMS/RRA", href: "/tickets/cams-rra", color: "purple", openInNewTab: false },
  { title: "Tools", href: "/tickets/tools", color: "teal", openInNewTab: false },
  { title: "Phoenix Team", href: "/tickets/phoenix-team", color: "red", openInNewTab: false },
]

export function TileGrid() {
  const [tiles, setTiles] = useState<TileData[]>(defaultTiles)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHomePageCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/categories/home')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (Array.isArray(data) && data.length > 0) {
          setTiles(data)
        }
      } catch (err) {
        console.error('Error loading home page categories:', err)
        setError('Failed to load categories. Using default categories instead.')
        // Keep using default tiles
      } finally {
        setLoading(false)
      }
    }

    fetchHomePageCategories()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {defaultTiles.slice(0, 8).map((tile, index) => (
          <div key={index} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
        ))}
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-700 dark:text-yellow-200 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((tile) => (
          <div key={tile.title} className="h-full">
            <Tile {...tile} />
          </div>
        ))}
      </div>
    </>
  )
}

