import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Check session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isProtectedRoute = [
      '/dashboard',
      '/pomodoro',
      '/goals',
      '/habits',
      '/journal',
    ].some(path => req.nextUrl.pathname.startsWith(path))

    // If no session and trying to access protected route
    if (!session && isProtectedRoute) {
      return NextResponse.redirect(new URL('/auth', req.url))
    }

    // If has session and trying to access auth page
    if (session && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, redirect to auth page
    return NextResponse.redirect(new URL('/auth', req.url))
  }
}

export const config = {
  matcher: [
    '/dashboard',
    '/auth',
    '/pomodoro',
    '/goals',
    '/habits',
    '/journal',
    '/(authenticated)/:path*'
  ],
} 