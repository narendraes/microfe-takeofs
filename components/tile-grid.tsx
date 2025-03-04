'use client'

import { useState, useEffect } from 'react'
import { Tile, type TileData } from "./tile"

// Default tiles as fallback
const defaultTiles: TileData[] = [
  { 
    title: "Banking Products", 
    description: "Submit ideas and feature requests for our banking solutions.",
    href: "/tickets/bank", 
    color: "blue", 
    openInNewTab: false 
  },
  { 
    title: "Directed Pay", 
    description: "Submit ideas for directed payment processing solutions.",
    href: "/tickets/directed-pay", 
    color: "green", 
    openInNewTab: false 
  },
  { 
    title: "SSO & API Services", 
    description: "Submit enhancement requests for SSO and API infrastructure.",
    href: "/tickets/sso-api", 
    color: "purple", 
    openInNewTab: false 
  },
  { 
    title: "Commercial Pay", 
    description: "Submit ideas for commercial payment solutions.",
    href: "/tickets/commercial-pay", 
    color: "indigo", 
    openInNewTab: false 
  },
  { 
    title: "Commercial Payment Product Area", 
    description: "Submit ideas for commercial payment product development.",
    href: "/tickets/commercial-provider", 
    color: "teal", 
    openInNewTab: false 
  },
  { 
    title: "Data Engineering", 
    description: "Submit ideas for data infrastructure and analytics solutions.",
    href: "/tickets/data-engineering", 
    color: "yellow", 
    openInNewTab: false 
  },
  { 
    title: "HBA", 
    description: "Submit ideas for HBA solutions and features.",
    href: "/tickets/hba", 
    color: "blue", 
    openInNewTab: false 
  },
  { 
    title: "CAMS & RRA", 
    description: "Submit ideas for CAMS and RRA solutions.",
    href: "/tickets/cams-rra", 
    color: "purple", 
    openInNewTab: false 
  },
  { 
    title: "Mobile Applications", 
    description: "Submit ideas for mobile application features and improvements.",
    href: "/tickets/tools", 
    color: "teal", 
    openInNewTab: false 
  },
  { 
    title: "Phoenix Team", 
    description: "Submit ideas for system modernization and transformation initiatives.",
    href: "/tickets/phoenix-team", 
    color: "red", 
    openInNewTab: false 
  },
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
          <div key={index} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"></div>
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
          <Tile key={tile.title} {...tile} />
        ))}
      </div>
    </>
  )
}

