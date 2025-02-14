import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Corporate Portal",
  description: "A micro frontend corporate portal",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Header with Logo */}
          <header className="border-b bg-background">
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Replace src with your actual logo path */}
                <Image
                  src="/logo.png"
                  alt="Corporate Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <span className="text-xl font-bold">LiftOFS</span>
              </div>
              <ThemeToggle />
            </div>
          </header>

          <div className="relative flex min-h-[calc(100vh-4rem)] flex-col">
            <div className="flex-1">
              <Tabs defaultValue="home" className="space-y-4">
                <div className="border-b">
                  <div className="container flex items-center">
                    <TabsList>
                      <TabsTrigger value="home" asChild>
                        <a href="/">Home</a>
                      </TabsTrigger>
                      {/* TODO: Future Tabs to be implemented
                      - Tab2: Product Management Dashboard
                      - Tab3: Platform Analytics
                      - Admin: Configuration and User Management
                      */}
                    </TabsList>
                  </div>
                </div>
                <TabsContent value="home" className="space-y-4">
                  {children}
                </TabsContent>
                {/* TODO: Content for future tabs
                <TabsContent value="tab2">
                  Product Management Dashboard content
                </TabsContent>
                <TabsContent value="tab3">
                  Platform Analytics content
                </TabsContent>
                <TabsContent value="admin">
                  Admin Panel content
                </TabsContent>
                */}
              </Tabs>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'