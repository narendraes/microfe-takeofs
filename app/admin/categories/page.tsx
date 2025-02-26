'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ProductContent } from '@/app/config/product-content-types'

export default function CategoryAdminPage() {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories. Check the console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-gray-100">Category Management</h1>
        <Link
          href="/admin/categories/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium"
        >
          Create New Category
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading categories...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No categories found</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Get started by creating a new category.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {categories.map((categoryId) => (
                <CategoryRow key={categoryId} categoryId={categoryId} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">How to manage categories</h3>
        <ul className="list-disc pl-5 text-blue-700 dark:text-blue-400 space-y-1">
          <li>Click "View/Edit" to see and edit category details</li>
          <li>Use "Create New Category" to add a new category</li>
          <li>Categories are stored as JSON files in the app/config/categories directory</li>
          <li>You can also edit the JSON files directly if you prefer</li>
        </ul>
      </div>
    </div>
  )
}

function CategoryRow({ categoryId }: { categoryId: string }) {
  const [title, setTitle] = useState<string>('Loading...')
  
  useEffect(() => {
    // Fetch category from the API
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch category: ${response.statusText}`);
        }
        
        const data: ProductContent = await response.json();
        setTitle(data.title);
      } catch (err) {
        console.error(`Error loading category ${categoryId}:`, err);
        setTitle('Error: Could not load title');
      }
    };

    fetchCategory();
  }, [categoryId])
  
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
        {categoryId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {title}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link
          href={`/admin/categories/${categoryId}`}
          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
        >
          View/Edit
        </Link>
        <Link
          href={`/tickets/${categoryId}`}
          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
          target="_blank"
        >
          View Page
        </Link>
      </td>
    </tr>
  )
} 