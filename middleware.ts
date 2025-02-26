import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Authentication Middleware
 * 
 * This middleware protects admin routes by checking for the presence of an 'admin=true' query parameter.
 * 
 * IMPORTANT: This is a simplified authentication mechanism for development purposes only.
 * In a production environment, you should implement a proper authentication system with:
 * - User accounts and secure login
 * - JWT or session-based authentication
 * - Role-based access control
 * - Secure password storage
 * 
 * See docs/AUTHENTICATION.md for recommended improvements and implementation options.
 */
export function middleware(request: NextRequest) {
  // Add detailed logging of the request
  console.log('Middleware triggered for path:', request.nextUrl.pathname);
  console.log('Full URL:', request.url);
  console.log('Query parameters:', Object.fromEntries(request.nextUrl.searchParams));
  
  // Check if the request is for the admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('Admin route detected, checking authentication');
    
    // For now, we're using a simple query parameter for "authentication"
    // In a real app, you would verify a JWT token or session cookie here
    const isAdmin = request.nextUrl.searchParams.get('admin') === 'true'
    console.log('Is admin?', isAdmin);
    
    if (!isAdmin) {
      // Log the authentication attempt
      console.log('Admin access denied, redirecting to home page');
      
      // Create URL with error parameter
      const redirectUrl = new URL('/', request.url);
      redirectUrl.searchParams.set('error', 'unauthorized');
      console.log('Redirecting to:', redirectUrl.toString());
      
      // Redirect to the home page if not authenticated
      return NextResponse.redirect(redirectUrl);
    }
    
    console.log('Admin access granted, continuing to requested page');
    
    // IMPORTANT: Pass through the query parameters including 'admin=true'
    // Create a new request with the same URL including query params
    const url = request.nextUrl.clone();
    
    console.log('Allowing access to:', url.toString());
    
    // User is authenticated, allow the request to proceed without modification
    return NextResponse.next();
  }
  
  return NextResponse.next()
}

/**
 * Middleware Configuration
 * 
 * This configuration ensures the middleware only runs on admin routes,
 * which improves performance by not running authentication checks on public routes.
 */
export const config = {
  matcher: '/admin/:path*',
} 