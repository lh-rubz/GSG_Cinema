import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if accessing admin routes
  if (pathname.startsWith('/admin')) {
    // Get user data from session storage (this won't work in middleware)
    // For proper server-side protection, you'd need to use cookies or JWT tokens
    // For now, we'll rely on client-side protection in the layout
    
    // You could implement JWT token validation here if using proper authentication
    // const token = request.cookies.get('auth-token')?.value
    // if (!token || !isValidAdminToken(token)) {
    //   return NextResponse.redirect(new URL('/403', request.url))
    // }
  }

  // Check if accessing staff routes
  if (pathname.startsWith('/staff')) {
    // Similar protection for staff routes
    // const token = request.cookies.get('auth-token')?.value
    // if (!token || !isValidStaffToken(token)) {
    //   return NextResponse.redirect(new URL('/403', request.url))
    // }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/staff/:path*',
  ]
}
