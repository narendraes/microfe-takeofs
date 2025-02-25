'use client'

import { TileGrid } from "@/components/tile-grid"
import Link from "next/link"
import Script from "next/script"
import { useEffect } from "react"

/**
 * Jira Issue Collector Configuration
 * This component integrates the Jira Issue Collector for feedback collection.
 * 
 * Requirements:
 * - jQuery must be loaded before the Jira collector script
 * - CSP must allow scripts from *.atlassian.net and ajax.googleapis.com
 * 
 * Debugging:
 * Check browser console for the following messages:
 * - "jQuery loaded": Confirms jQuery script loaded successfully
 * - "Jira collector script loaded": Confirms Jira collector script loaded
 * - "Jira collector initialized": Confirms collector was configured
 * - "jQuery not loaded": Error when jQuery fails to load
 */

// Extend Window interface to include Jira properties
declare global {
  interface Window {
    ATL_JQ_PAGE_PROPS: any;
    jQuery: any;
    $: any;
  }
}

export default function Home() {
  useEffect(() => {
    const initJiraCollector = () => {
      if (window.jQuery) {
        try {
          window.ATL_JQ_PAGE_PROPS = {
            triggerPosition: "bottom-right",
            triggerText: "Support",
            collectFeedback: true,
            fieldValues: {
              summary: "Feedback from Product Platform Intake Portal",
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
  }, []);

  return (
    <main className="container mx-auto px-4">
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
      <h1 className="text-4xl font-bold mb-8">Welcome to Product Platform Intake Portal</h1>
      <p className="font-normal mb-8">Click Product or Platform to submit idea Intake</p>
      
      {/* Added margin bottom for spacing */}
      <div className="mb-16">
        <TileGrid />
      </div>
      
      {/* Footer Section with added top margin */}
      <footer className="mt-auto py-8 border-t">
        <p className="font-bold mb-4">Access/Support</p>
        
        {/* Table of Links with improved spacing */}
        <table className="w-full mt-4">
          <tbody>
            <tr className="space-x-4">
              <td className="py-2">  Get access to Product Intake - 
                <Link href="/idea-contributor-access" className="underline hover:text-primary">
                   Idea Contributor Access
                </Link>
              </td>
              <td className="px-4">|</td>
              <td className="py-2">
                <Link href="/of-jira-access" className="underline hover:text-primary">
                  OF Jira Access
                </Link>
              </td>
              <td className="px-4">|</td>
              <td className="py-2">
                <Link href="/support" className="underline hover:text-primary">
                  Support
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </footer>
    </main>
  )
}

