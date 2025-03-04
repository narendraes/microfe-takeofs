'use client'

import { useState, useEffect } from 'react'
import { Tile, type TileData } from "./tile"

// Default tiles as fallback (only hrefs, other data will be fetched)
const defaultCategories = [
  "bank",
  "directed-pay",
  "sso-api",
  "commercial-pay",
  "commercial-provider",
  "data-engineering",
  "hba",
  "cams-rra",
  "tools",
  "phoenix-team"
]

export function TileGrid() {
  const [tiles, setTiles] = useState<TileData[]>([])
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
        } else {
          // If no data from API, create tiles from default categories
          const defaultTiles = defaultCategories.map(category => ({
            href: `/tickets/${category}`
          }))
          setTiles(defaultTiles)
        }
      } catch (err) {
        console.error('Error loading home page categories:', err)
        setError('Failed to load categories. Using default categories instead.')
        
        // Create tiles from default categories
        const defaultTiles = defaultCategories.map(category => ({
          href: `/tickets/${category}`
        }))
        setTiles(defaultTiles)
      } finally {
        setLoading(false)
      }
    }

    fetchHomePageCategories()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {defaultCategories.slice(0, 8).map((_, index) => (
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
        {tiles.map((tile, index) => (
          <Tile key={index} {...tile} />
        ))}
      </div>
    </>
  )
}

