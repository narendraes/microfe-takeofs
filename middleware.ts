import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware protects admin routes
// In a real application, you would implement proper authentication
export function middleware(request: NextRequest) {
  // Check if the request is for the admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // For now, we're using a simple query parameter for "authentication"
    // In a real app, you would use a proper authentication system
    const isAdmin = request.nextUrl.searchParams.get('admin') === 'true'
    
    if (!isAdmin) {
      // Redirect to the home page if not authenticated
      return NextResponse.redirect(new URL('/?error=unauthorized', request.url))
    }
  }
  
  return NextResponse.next()
}

// Only run the middleware on admin routes
export const config = {
  matcher: '/admin/:path*',
} 