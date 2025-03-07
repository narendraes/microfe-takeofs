'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProductContent } from '@/app/config/product-content-types'
import { RichTextEditor } from '@/components/rich-text-editor'
import { useParams } from 'next/navigation'

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
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
  const [needAccessTitle, setNeedAccessTitle] = useState('')
  const [needAccessUrl, setNeedAccessUrl] = useState('')
  const [showSection2, setShowSection2] = useState(true)
  const [notFound, setNotFound] = useState(false)
  
  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        console.log(`Fetching category: ${categoryId}`);
        const response = await fetch(`/api/categories/${categoryId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setNotFound(true);
          } else {
            throw new Error(`Failed to fetch category: ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          setCategory(data);
          setNotFound(false);
          
          // Initialize display settings
          setShowOnHomePage(data.displaySettings?.showOnHomePage || false);
          setDisplayOrder(data.displaySettings?.displayOrder || 999);
          setTileColor(data.displaySettings?.tileColor || 'blue');
          
          // Initialize submit button settings
          setSubmitButtonText(data.submitButton?.text || 'Submit New Idea');
          setSubmitButtonUrl(data.submitButton?.url || '');
          
          // Initialize need access settings
          setNeedAccessTitle(data.needAccess?.title || '');
          setNeedAccessUrl(data.needAccess?.url || '');
  
          // Check if section 2 exists and has content
          setShowSection2(data.sections.length > 1 && Boolean(data.sections[1]));
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        setError('Failed to fetch category data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    // Prepare sections based on showSection2 flag
    let updatedSections = [...category.sections];
    
    // Ensure we have at least one section
    if (updatedSections.length === 0) {
      updatedSections.push({ title: 'Section 1', content: '' });
    }
    
    // Handle section 2 visibility
    if (showSection2) {
      // Ensure we have a second section
      if (updatedSections.length < 2) {
        updatedSections.push({ title: 'Section 2', content: '' });
      }
    } else {
      // Remove section 2 if it exists and showSection2 is false
      if (updatedSections.length > 1) {
        updatedSections = updatedSections.slice(0, 1);
      }
    }
    
    // Update display settings
    const updatedCategory = {
      ...category!,
      sections: updatedSections,
      displaySettings: {
        showOnHomePage,
        displayOrder,
        tileColor
      },
      submitButton: {
        text: submitButtonText,
        url: submitButtonUrl
      },
      needAccess: {
        title: needAccessTitle,
        url: needAccessUrl
      }
    };
    
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
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
    
    // Ensure the section exists
    if (!updatedSections[index]) {
      updatedSections[index] = { title: `Section ${index + 1}`, content: '' };
    }
    
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
        ...category.contactInfo || {}, // Handle case where contactInfo might be undefined
        [field]: value,
      },
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-pulse text-xl dark:text-gray-100">Loading...</div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold dark:text-gray-100">Category Not Found</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">The category you're looking for doesn't exist.</p>
          <Link href="/admin/categories" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold dark:text-gray-100">Error Loading Category</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">There was a problem loading this category.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-gray-100">Edit Category: {categoryId}</h1>
        <div className="space-x-4">
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
                maxLength={256}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Brief description (max 256 characters). {category.description.length}/256
              </p>
            </div>
          </div>
        </div>

        {/* Home Page Display Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Home Page Display Settings</h2>
          <div className="space-y-4">
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Display Settings</h3>
              <div className="mt-2">
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
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Display order can be managed from the <Link href="/admin/categories" className="text-blue-500 hover:underline">categories admin page</Link>.
                </p>
              </div>
              
              <div className="mt-4">
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
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Select a color for the category tile on the home page.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Sections</h2>
          <div className="space-y-6">
            {/* Section 1 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
              <h3 className="text-lg font-medium mb-3 dark:text-gray-200">Section 1</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={category.sections[0]?.title || ''}
                    onChange={(e) => handleSectionChange(0, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content
                  </label>
                  <RichTextEditor
                    content={category.sections[0]?.content || ''}
                    onChange={(value) => handleSectionChange(0, 'content', value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2 Toggle */}
            <div className="flex items-center space-x-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showSection2}
                  onChange={() => setShowSection2(!showSection2)}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Include Section 2
                </span>
              </label>
            </div>

            {/* Section 2 (Conditional) */}
            {showSection2 && category && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="text-lg font-medium mb-3 dark:text-gray-200">Section 2</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={category.sections[1]?.title || ''}
                      onChange={(e) => handleSectionChange(1, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                      required={showSection2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Content
                    </label>
                    <RichTextEditor
                      content={category.sections[1]?.content || ''}
                      onChange={(value) => handleSectionChange(1, 'content', value)}
                      required={showSection2}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Guidelines */}
        {category && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Guidelines</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={category.guidelines?.title || ''}
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
                  value={category.guidelines?.items?.join('\n') || ''}
                  onChange={(e) => handleGuidelineChange('items', e.target.value.split('\n'))}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Contact Info */}
        {category && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Contact Information</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">All fields are optional. Leave empty to hide contact information.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={category.contactInfo?.name || ''}
                  onChange={(e) => handleContactChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={category.contactInfo?.role || ''}
                  onChange={(e) => handleContactChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={category.contactInfo?.email || ''}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        )}

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

        {/* Need Access Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Need Access Settings</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Customize the "Need Access" link that appears on the category page. Leave fields empty to hide this section.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Link Text
              </label>
              <input
                type="text"
                value={needAccessTitle}
                onChange={(e) => setNeedAccessTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                placeholder="Need access? Visit Idea Contributor Access"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Link URL
              </label>
              <input
                type="text"
                value={needAccessUrl}
                onChange={(e) => setNeedAccessUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100"
                placeholder="/idea-contributor-access"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter the URL where users will be directed when they click the "Need Access" link.
                You can use a relative path (e.g., /idea-contributor-access) or a full URL.
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