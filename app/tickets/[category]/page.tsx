'use client'

import { notFound } from "next/navigation"
import { ProductSection, GuidelinesSection, ContactInfo } from "@/src/components/product-section"
import Script from "next/script"
import { useEffect, useState } from "react"
import { ProductContent } from "@/app/config/product-content-types"

// Extend Window interface to include Jira properties
declare global {
  interface Window {
    ATL_JQ_PAGE_PROPS: any;
    jQuery: any;
    $: any;
  }
}

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

  useEffect(() => {
    const initJiraCollector = () => {
      if (window.jQuery) {
        try {
          window.ATL_JQ_PAGE_PROPS = {
            triggerPosition: "bottom-right",
            triggerText: "Support",
            collectFeedback: true,
            fieldValues: {
              summary: `Feedback from ${params.category} category page`,
            }
          };
          console.log("Jira collector initialized with config:", window.ATL_JQ_PAGE_PROPS);
        } catch (error) {
          console.error("Failed to initialize Jira collector:", error);
        }
      }
    };

    // Check if jQuery is loaded with retry mechanism
    let retryCount = 0;
    const maxRetries = 3;
    
    const checkJQuery = () => {
      if (window.jQuery) {
        console.log("jQuery detected, version:", window.jQuery.fn.jquery);
        initJiraCollector();
      } else if (retryCount < maxRetries) {
        retryCount++;
        console.log(`jQuery not found, retrying (${retryCount}/${maxRetries})...`);
        setTimeout(checkJQuery, 1000); // Retry after 1 second
      } else {
        console.error("jQuery not loaded after maximum retries - Jira Issue Collector may not work");
      }
    };

    checkJQuery();

    return () => {
      // Cleanup if needed
      retryCount = maxRetries; // Prevent further retries
    };
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
        
        {/* jQuery Script */}
        <Script
          id="jquery"
          src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"
          strategy="beforeInteractive"
          onLoad={() => console.log("jQuery loaded successfully")}
          onError={(e) => console.error("Failed to load jQuery:", e)}
        />
        
        {/* Jira Issue Collector Script */}
        <Script
          id="jira-issue-collector"
          src="https://nkes.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/g2slup/b/0/c95134bc67d3a521bb3f4331beb9b804/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=898847bc"
          strategy="afterInteractive"
          onLoad={() => console.log("Jira collector script loaded successfully")}
          onError={(e) => console.error("Failed to load Jira collector script:", e)}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* jQuery Script */}
      <Script
        id="jquery"
        src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"
        strategy="beforeInteractive"
        onLoad={() => console.log("jQuery loaded successfully")}
        onError={(e) => console.error("Failed to load jQuery:", e)}
      />
      
      {/* Jira Issue Collector Script */}
      <Script
        id="jira-issue-collector"
        src="https://nkes.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/g2slup/b/0/c95134bc67d3a521bb3f4331beb9b804/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=898847bc"
        strategy="afterInteractive"
        onLoad={() => console.log("Jira collector script loaded successfully")}
        onError={(e) => console.error("Failed to load Jira collector script:", e)}
      />
      
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
          
          <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium shadow-sm transition-colors">
            Submit New Idea
          </button>
        </div>
      </div>
    </div>
  )
}

