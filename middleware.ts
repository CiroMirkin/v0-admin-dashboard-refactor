import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Redirect common incorrect login routes to correct one
  if (pathname === '/login/admin' || pathname === '/login' || pathname === '/admin/login/') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    
    // Preserve any query parameters
    if (request.nextUrl.search) {
      url.search = request.nextUrl.search
    }
    
    return NextResponse.redirect(url)
  }
  
  // Redirect trailing slash versions of admin routes (except login)
  if (pathname !== '/admin/login/' && pathname.endsWith('/') && pathname.startsWith('/admin/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(0, -1)
    
    if (request.nextUrl.search) {
      url.search = request.nextUrl.search
    }
    
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login/admin',
    '/login',
    '/admin/login/',
    '/admin/:path*/'
  ]
}