'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProductContent } from '@/app/config/product-content-types'

export default function NewCategoryPage() {
  const router = useRouter()
  const [categoryId, setCategoryId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showOnHomePage, setShowOnHomePage] = useState(false)
  const [displayOrder, setDisplayOrder] = useState(999)
  const [tileColor, setTileColor] = useState('blue')
  
  // Default template for a new category
  const defaultCategory: ProductContent = {
    title: '',
    description: '',
    sections: [
      {
        title: 'What We Do',
        content: 'Describe what this category/team does.',
        subsections: [
          {
            title: 'Key Focus Areas',
            items: ['Area 1', 'Area 2', 'Area 3']
          }
        ]
      },
      {
        title: 'Current Priorities',
        content: 'Describe current priorities for this category/team.',
        subsections: []
      }
    ],
    guidelines: {
      title: 'Submission Guidelines',
      items: [
        'Guideline 1',
        'Guideline 2',
        'Guideline 3'
      ]
    },
    contactInfo: {
      name: '',
      role: '',
      email: ''
    },
    displaySettings: {
      showOnHomePage: false,
      displayOrder: 999,
      tileColor: 'blue'
    }
  }
  
  const [category, setCategory] = useState<ProductContent>(defaultCategory)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!categoryId.trim()) {
      setError('Category ID is required')
      return
    }
    
    // Validate category ID format (lowercase, no spaces, only hyphens)
    const categoryIdRegex = /^[a-z0-9-]+$/
    if (!categoryIdRegex.test(categoryId)) {
      setError('Category ID must be lowercase with no spaces (use hyphens instead)')
      return
    }
    
    setSaving(true)
    setError(null)
    
    // Update display settings
    const updatedCategory = {
      ...category,
      displaySettings: {
        showOnHomePage,
        displayOrder,
        tileColor
      }
    }
    
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId,
          content: updatedCategory
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create category')
      }
      
      // Redirect to the category edit page
      router.push(`/admin/categories/${categoryId}?admin=true`)
    } catch (err: any) {
      console.error('Error creating category:', err)
      setError(err.message || 'Failed to create category. Please try again.')
      setSaving(false)
    }
  }

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setCategory({
      ...category,
      [field]: value,
    })
  }

  // Handle contact info changes
  const handleContactChange = (field: string, value: string) => {
    setCategory({
      ...category,
      contactInfo: {
        ...category.contactInfo,
        [field]: value,
      },
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-gray-100">Create New Category</h1>
        <Link
          href="/admin/categories?admin=true"
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 font-medium"
        >
          Back to Categories
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Category Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category ID
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 mr-2">/tickets/</span>
                <input
                  type="text"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="e.g. mobile-apps"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Use lowercase letters, numbers, and hyphens only. This will be used in the URL.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={category.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g. Mobile Applications"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={category.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Brief description of this category"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                required
              />
            </div>
          </div>
        </div>

        {/* Home Page Display Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Home Page Display Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showOnHomePage}
                  onChange={() => setShowOnHomePage(!showOnHomePage)}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show on Home Page
                </span>
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                  disabled={!showOnHomePage}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Lower numbers appear first on the home page.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tile Color
                </label>
                <select
                  value={tileColor}
                  onChange={(e) => setTileColor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                  disabled={!showOnHomePage}
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="red">Red</option>
                  <option value="yellow">Yellow</option>
                  <option value="purple">Purple</option>
                  <option value="gray">Gray</option>
                  <option value="indigo">Indigo</option>
                  <option value="teal">Teal</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={category.contactInfo.name}
                onChange={(e) => handleContactChange('name', e.target.value)}
                placeholder="Contact person's name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <input
                type="text"
                value={category.contactInfo.role}
                onChange={(e) => handleContactChange('role', e.target.value)}
                placeholder="e.g. Team Lead"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={category.contactInfo.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                placeholder="contact@example.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">Note</h3>
          <p className="text-blue-700 dark:text-blue-400">
            After creating the category, you'll be redirected to the edit page where you can customize the sections and guidelines.
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/categories?admin=true"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  )
} 