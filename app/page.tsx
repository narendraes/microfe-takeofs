'use client'

import { TileGrid } from "@/components/tile-grid"
import Link from "next/link"
import Script from "next/script"
import { useEffect } from "react"

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
        window.ATL_JQ_PAGE_PROPS = {
          triggerPosition: "bottom-right",
          triggerText: "Support",
          collectFeedback: true,
          fieldValues: {
            // You can pre-populate fields here
            summary: "Feedback from Product Platform Intake Portal",
          }
        };
      }
    };

    // Check if jQuery is loaded
    if (window.jQuery) {
      initJiraCollector();
    } else {
      console.error("jQuery not loaded - Jira Issue Collector may not work");
    }
  }, []);

  return (
    <main className="container mx-auto px-4">
      {/* jQuery Script */}
      <Script
        id="jquery"
        src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"
        strategy="beforeInteractive"
        onLoad={() => console.log("jQuery loaded")}
      />
      
      {/* Jira Issue Collector Script */}
      <Script
        id="jira-issue-collector"
        src="https://nkes.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/g2slup/b/0/c95134bc67d3a521bb3f4331beb9b804/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=898847bc"
        strategy="afterInteractive"
        onLoad={() => console.log("Jira collector script loaded")}
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

