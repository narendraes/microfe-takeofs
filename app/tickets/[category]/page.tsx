'use client'

import { notFound } from "next/navigation"
import { ProductSection, GuidelinesSection, ContactInfo } from "@/src/components/product-section"
import { useEffect, useState } from "react"
import { ProductContent } from "@/app/config/product-content-types"

export default function TicketPage({ params }: { params: { category: string } }) {
  const [content, setContent] = useState<ProductContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch category data from API
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetch(`/api/categories/${params.category}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error(`Failed to fetch category data: ${response.statusText}`);
        }
        
        const data = await response.json();
        setContent(data);
        setError(false);
      } catch (err) {
        console.error("Error fetching category data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [params.category]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-xl dark:text-gray-100">Loading...</div>
      </div>
    );
  }

  // Error state
  if (error || !content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">Content Coming Soon</h1>
        <p className="dark:text-gray-300">The content for this product area is being developed.</p>
      </div>
    )
  }

  // Function to ensure URL is properly formatted with protocol
  const formatUrl = (url: string): string => {
    if (!url) return '#';
    
    // Check if the URL already has a protocol
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Add https:// protocol if missing
    return `https://${url}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 dark:text-gray-100">{content.title}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{content.description}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {content.sections.map((section: ProductContent['sections'][0], index: number) => (
            <ProductSection 
              key={index}
              title={section.title}
              content={section.content}
              subsections={section.subsections}
            />
          ))}
        </div>
        
        <div className="space-y-8">
          <GuidelinesSection 
            title={content.guidelines.title}
            items={content.guidelines.items}
          />
          <ContactInfo {...content.contactInfo} />
          
          <a 
            href={formatUrl(content.submitButton?.url || '#')} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium shadow-sm transition-colors text-center"
          >
            {content.submitButton?.text || 'Submit New Idea'}
          </a>
        </div>
      </div>
    </div>
  )
}

