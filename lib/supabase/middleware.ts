import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Create the response first
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set(name, value, options)
        },
        remove(name: string, options: any) {
          response.cookies.set(name, '', options)
        },
      },
    }
  )

  // Get user and session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the current path is public
  const isPublicPath = 
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname.startsWith('/auth')

  // If no user and not a public path, redirect to login
  if (!user && !isPublicPath) {
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Handle authenticated user redirects
  if (user && session) {
    const url = request.nextUrl.clone()
    if (url.pathname === '/') {
      const username = user.user_metadata.user_name

      if (!username) {
        return NextResponse.redirect(new URL('/complete-profile', request.url))
      }

      return NextResponse.redirect(new URL(`/${username}/dashboard`, request.url))
    }
  }

  // For all other cases, return the response with the updated session
  return response
}