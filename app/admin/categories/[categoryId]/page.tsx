'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProductContent } from '@/app/config/product-content-types'

export default function EditCategoryPage({ params }: { params: { categoryId: string } }) {
  const router = useRouter()
  const [category, setCategory] = useState<ProductContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showOnHomePage, setShowOnHomePage] = useState(false)
  const [displayOrder, setDisplayOrder] = useState(999)
  const [tileColor, setTileColor] = useState('blue')
  const [submitButtonText, setSubmitButtonText] = useState('Submit New Idea')
  const [submitButtonUrl, setSubmitButtonUrl] = useState('')
  
  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        console.log(`Fetching category: ${params.categoryId}`);
        const response = await fetch(`/api/categories/${params.categoryId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch category: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Category data loaded:', data.title);
        setCategory(data);
        
        // Initialize display settings
        setShowOnHomePage(data.displaySettings?.showOnHomePage || false);
        setDisplayOrder(data.displaySettings?.displayOrder || 999);
        setTileColor(data.displaySettings?.tileColor || 'blue');
        
        // Initialize submit button settings
        if (data.submitButton) {
          setSubmitButtonText(data.submitButton.text || 'Submit New Idea');
          setSubmitButtonUrl(data.submitButton.url || '');
        }
        
        setError(null);
      } catch (err) {
        console.error(`Error loading category ${params.categoryId}:`, err);
        setError('Failed to load category. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [params.categoryId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category) return;
    
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    // Update display settings
    const updatedCategory = {
      ...category,
      displaySettings: {
        showOnHomePage,
        displayOrder,
        tileColor
      },
      submitButton: {
        text: submitButtonText,
        url: submitButtonUrl
      }
    };
    
    try {
      const response = await fetch(`/api/categories/${params.categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCategory),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save category: ${response.statusText}`);
      }
      
      setCategory(updatedCategory);
      setSaveSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving category:', err);
      setSaveError('Failed to save category. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    if (!category) return;
    
    setCategory({
      ...category,
      [field]: value,
    });
  };

  // Handle section changes
  const handleSectionChange = (index: number, field: string, value: string) => {
    if (!category) return;
    
    const updatedSections = [...category.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value,
    };
    
    setCategory({
      ...category,
      sections: updatedSections,
    });
  };

  // Handle guideline changes
  const handleGuidelineChange = (field: string, value: string | string[]) => {
    if (!category) return;
    
    setCategory({
      ...category,
      guidelines: {
        ...category.guidelines,
        [field]: value,
      },
    });
  };

  // Handle contact info changes
  const handleContactChange = (field: string, value: string) => {
    if (!category) return;
    
    setCategory({
      ...category,
      contactInfo: {
        ...category.contactInfo,
        [field]: value,
      },
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-gray-100">Edit Category: {params.categoryId}</h1>
          <Link
            href="/admin/categories?admin=true"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 font-medium"
          >
            Back to Categories
          </Link>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading category...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-gray-100">Edit Category: {params.categoryId}</h1>
          <Link
            href="/admin/categories?admin=true"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 font-medium"
          >
            Back to Categories
          </Link>
        </div>
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          <p>{error || 'Category not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-gray-100">Edit Category: {params.categoryId}</h1>
        <div className="space-x-4">
          <Link
            href={`/tickets/${params.categoryId}`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 font-medium"
            target="_blank"
          >
            View Page
          </Link>
          <Link
            href="/admin/categories?admin=true"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 font-medium"
          >
            Back to Categories
          </Link>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-200 px-4 py-3 rounded mb-4">
          <p>Category saved successfully!</p>
        </div>
      )}

      {saveError && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          <p>{saveError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={category.title}
                onChange={(e) => handleChange('title', e.target.value)}
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

        {/* Sections */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Sections</h2>
          <div className="space-y-6">
            {category.sections.map((section, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="text-lg font-medium mb-3 dark:text-gray-200">Section {index + 1}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Content
                    </label>
                    <textarea
                      value={section.content}
                      onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Guidelines</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={category.guidelines.title}
                onChange={(e) => handleGuidelineChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Items (one per line)
              </label>
              <textarea
                value={category.guidelines.items.join('\n')}
                onChange={(e) => handleGuidelineChange('items', e.target.value.split('\n'))}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                required
              />
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Submit Button Settings</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Customize the "Submit New Idea" button that appears on the category page.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={submitButtonText}
                onChange={(e) => setSubmitButtonText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                placeholder="Submit New Idea"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Button URL
              </label>
              <input
                type="text"
                value={submitButtonUrl}
                onChange={(e) => setSubmitButtonUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                placeholder="https://example.com/submit-idea"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter the full URL where users will be directed when they click the button.
                Make sure to include the protocol (https:// or http://) for external URLs.
              </p>
            </div>
          </div>
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
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 