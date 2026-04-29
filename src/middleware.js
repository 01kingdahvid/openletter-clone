import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware (request) {
  let response = NextResponse.next({
    request: { headers: request.headers }
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get (name) {
          return request.cookies.get(name)?.value
        },
        set (name, value, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers }
          })
          response.cookies.set({ name, value, ...options })
        },
        remove (name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers }
          })
          response.cookies.set({ name, value: '', ...options })
        }
      }
    }
  )

  const {
    data: { session }
  } = await supabase.auth.getSession()
  const { pathname } = request.nextUrl

  // Redirect logged-in users away from /verify
  if (pathname.startsWith('/verify') && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect /dashboard and /admin
  if (pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/?auth=required', request.url))
  }
  if (pathname.startsWith('/admin') && !session) {
    return NextResponse.redirect(new URL('/?auth=required', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/verify']
}
