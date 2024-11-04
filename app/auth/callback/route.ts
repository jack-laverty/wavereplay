import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && user) {

      // Get username from user metadata or fallback to email
      const username = user.user_metadata.user_name || user.email?.split('@')[0]
      
      // This is the path we want to redirect to
      const dashboardPath = `/${username}/dashboard`
      
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${dashboardPath}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${dashboardPath}`)
      } else {
        return NextResponse.redirect(`${origin}${dashboardPath}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}