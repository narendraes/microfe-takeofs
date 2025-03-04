'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ProductContent } from '@/app/config/product-content-types'

export default function CategoryAdminPage() {
  const [categories, setCategories] = useState<string[]>([])
  const [categoryDetails, setCategoryDetails] = useState<Record<string, ProductContent>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [homePageOrder, setHomePageOrder] = useState<Record<string, number>>({})
  const [savingSettings, setSavingSettings] = useState<Record<string, boolean>>({})
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({})
  const [saveSuccess, setSaveSuccess] = useState<Record<string, boolean>>({})
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [confirmDeleteText, setConfirmDeleteText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/categories')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`)
        }
        
        const data = await response.json()
        setCategories(data)
        
        // Fetch details for each category
        const details: Record<string, ProductContent> = {}
        for (const category of data) {
          const detailResponse = await fetch(`/api/categories/${category}`)
          if (detailResponse.ok) {
            const detailData = await detailResponse.json()
            details[category] = detailData
          }
        }
        
        setCategoryDetails(details)
        
        // Initialize home page order
        const orderMap: Record<string, number> = {}
        Object.entries(details).forEach(([id, content]) => {
          orderMap[id] = content.displaySettings?.displayOrder || 999
        })
        setHomePageOrder(orderMap)
      } catch (err) {
        console.error('Error loading categories:', err)
        setError('Failed to load categories. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Handle toggling display on home page
  const handleToggleHomePageDisplay = async (categoryId: string) => {
    const category = categoryDetails[categoryId]
    if (!category) return
    
    const currentSettings = category.displaySettings || { showOnHomePage: false, displayOrder: 999 }
    const newSettings = {
      ...currentSettings,
      showOnHomePage: !currentSettings.showOnHomePage
    }
    
    await updateDisplaySettings(categoryId, newSettings)
  }

  // Handle changing display order
  const handleOrderChange = async (categoryId: string, order: number) => {
    // Update local state first for immediate UI feedback
    setHomePageOrder({
      ...homePageOrder,
      [categoryId]: order
    })
    
    // Then save to the server
    const category = categoryDetails[categoryId]
    if (!category) return
    
    const currentSettings = category.displaySettings || { showOnHomePage: false, displayOrder: 999 }
    const newSettings = {
      ...currentSettings,
      displayOrder: order
    }
    
    await updateDisplaySettings(categoryId, newSettings)
  }

  // Handle changing tile color
  const handleColorChange = async (categoryId: string, color: string) => {
    const category = categoryDetails[categoryId]
    if (!category) return
    
    const currentSettings = category.displaySettings || { showOnHomePage: false, displayOrder: 999 }
    const newSettings = {
      ...currentSettings,
      tileColor: color
    }
    
    await updateDisplaySettings(categoryId, newSettings)
  }

  // Update display settings via API
  const updateDisplaySettings = async (categoryId: string, settings: any) => {
    setSavingSettings({ ...savingSettings, [categoryId]: true })
    setSaveErrors({ ...saveErrors, [categoryId]: '' })
    setSaveSuccess({ ...saveSuccess, [categoryId]: false })
    
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displaySettings: settings }),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update settings: ${response.statusText}`)
      }
      
      // Update local state
      setCategoryDetails({
        ...categoryDetails,
        [categoryId]: {
          ...categoryDetails[categoryId],
          displaySettings: settings
        }
      })
      
      setSaveSuccess({ ...saveSuccess, [categoryId]: true })
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess((prev) => ({ ...prev, [categoryId]: false }))
      }, 3000)
    } catch (err) {
      console.error(`Error updating display settings for ${categoryId}:`, err)
      setSaveErrors({ ...saveErrors, [categoryId]: 'Failed to save settings' })
    } finally {
      setSavingSettings({ ...savingSettings, [categoryId]: false })
    }
  }

  // Handle opening delete modal
  const openDeleteModal = (categoryId: string) => {
    setCategoryToDelete(categoryId)
    setConfirmDeleteText('')
    setDeleteError(null)
    setDeleteModalOpen(true)
  }

  // Handle closing delete modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setCategoryToDelete(null)
    setConfirmDeleteText('')
    setDeleteError(null)
  }

  // Handle delete category
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return
    
    const category = categoryDetails[categoryToDelete]
    if (!category) return
    
    // Check if confirmation text matches category title
    if (confirmDeleteText !== category.title) {
      setDeleteError('Category name does not match. Please try again.')
      return
    }
    
    setIsDeleting(true)
    setDeleteError(null)
    
    try {
      const response = await fetch(`/api/categories/${categoryToDelete}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete category: ${response.statusText}`)
      }
      
      // Remove category from state
      setCategories(categories.filter(id => id !== categoryToDelete))
      
      // Close modal
      closeDeleteModal()
    } catch (err) {
      console.error(`Error deleting category ${categoryToDelete}:`, err)
      setDeleteError('Failed to delete category. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Component for displaying a category row
  const CategoryRow = ({ categoryId }: { categoryId: string }) => {
    const category = categoryDetails[categoryId]
    if (!category) return null
    
    const displaySettings = category.displaySettings || { showOnHomePage: false, displayOrder: 999, tileColor: 'blue' }
    
    return (
      <tr className="border-b dark:border-gray-700">
        <td className="py-4 px-6">{category.title}</td>
        <td className="py-4 px-6">
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={displaySettings.showOnHomePage}
                onChange={() => handleToggleHomePageDisplay(categoryId)}
                disabled={savingSettings[categoryId]}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="flex flex-col space-y-2 w-48">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Priority:</span>
              <span className="text-sm font-medium ml-2">
                {homePageOrder[categoryId] <= 10 ? 'High' : 
                 homePageOrder[categoryId] <= 50 ? 'Medium' : 'Low'}
                ({homePageOrder[categoryId] || displaySettings.displayOrder || 999})
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={homePageOrder[categoryId] || displaySettings.displayOrder || 999}
              onChange={(e) => handleOrderChange(categoryId, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              disabled={!displaySettings.showOnHomePage || savingSettings[categoryId]}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>High</span>
              <span>Medium</span>
              <span>Low</span>
            </div>
          </div>
        </td>
        <td className="py-4 px-6">
          <select
            value={displaySettings.tileColor || 'blue'}
            onChange={(e) => handleColorChange(categoryId, e.target.value)}
            disabled={!displaySettings.showOnHomePage || savingSettings[categoryId]}
            className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
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
        </td>
        <td className="py-4 px-6">
          {saveSuccess[categoryId] && (
            <span className="text-green-600 dark:text-green-400">Settings saved!</span>
          )}
          {saveErrors[categoryId] && (
            <span className="text-red-600 dark:text-red-400">{saveErrors[categoryId]}</span>
          )}
        </td>
        <td className="py-4 px-6 flex space-x-3">
          <Link
            href={`/admin/categories/${categoryId}?admin=true`}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            View/Edit
          </Link>
          <button
            onClick={() => openDeleteModal(categoryId)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
          >
            Delete
          </button>
        </td>
      </tr>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-gray-100">Category Management</h1>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-gray-100">Category Management</h1>
        <Link
          href="/admin/categories/new?admin=true"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium"
        >
          Create New Category
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-gray-200">Home Page Display Settings</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Configure which categories appear on the home page and their display order. Categories are sorted by display order (lowest first).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-6 font-medium">Category</th>
                <th className="py-3 px-6 font-medium">Show on Home</th>
                <th className="py-3 px-6 font-medium">
                  <div className="flex items-center">
                    Display Order
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  </div>
                </th>
                <th className="py-3 px-6 font-medium">Tile Color</th>
                <th className="py-3 px-6 font-medium">Status</th>
                <th className="py-3 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories
                .sort((a, b) => {
                  // Get display order for both categories
                  const orderA = categoryDetails[a]?.displaySettings?.displayOrder || 999;
                  const orderB = categoryDetails[b]?.displaySettings?.displayOrder || 999;
                  
                  // Sort by display order (ascending)
                  return orderA - orderB;
                })
                .map((categoryId) => (
                  <CategoryRow key={categoryId} categoryId={categoryId} />
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">How to manage categories</h3>
        <ul className="list-disc pl-5 text-blue-700 dark:text-blue-400 space-y-1">
          <li>Click "View/Edit" to see and edit category details</li>
          <li>Use "Create New Category" to add a new category</li>
          <li>Categories are stored as JSON files in the app/config/categories directory</li>
          <li>You can also edit the JSON files directly if you prefer</li>
        </ul>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4 dark:text-gray-100">Delete Category</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to delete the category <span className="font-bold">{categoryToDelete && categoryDetails[categoryToDelete]?.title}</span>? This action cannot be undone.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              To confirm, please type the category name below:
            </p>
            <input
              type="text"
              value={confirmDeleteText}
              onChange={(e) => setConfirmDeleteText(e.target.value)}
              placeholder="Type category name here"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-gray-100 mb-4"
            />
            {deleteError && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
                <p>{deleteError}</p>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                disabled={isDeleting || confirmDeleteText !== (categoryToDelete && categoryDetails[categoryToDelete]?.title)}
                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  isDeleting || confirmDeleteText !== (categoryToDelete && categoryDetails[categoryToDelete]?.title)
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {isDeleting ? 'Deleting...' : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 