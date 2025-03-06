'use client'

import { TileGrid } from "@/components/tile-grid"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="container mx-auto px-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
        <Card>
          <CardHeader>
            <CardTitle>PromptDojo</CardTitle>
            <CardDescription>AI-powered Jira Integration</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Access Jira data through natural language queries. Get insights, reports, and analytics with ease.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/promptdojo">Open PromptDojo</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

