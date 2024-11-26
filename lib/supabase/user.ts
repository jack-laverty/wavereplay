import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { Session } from '@supabase/supabase-js'

export async function getUsername(): Promise<string> {
  const supabase = createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error fetching user:', error.message)
      redirect('/login') // Redirect to login if there's an error
    }
    
    if (!user) {
      redirect('/login') // Redirect to login if no user
    }

    const username = user.user_metadata.user_name
    
    if (!username) {
      redirect('/complete-profile') // Redirect to profile completion if no username
    }

    return username
  } catch (error) {
    console.error('Unexpected error fetching user:', error)
    redirect('/login')
  }
}

export async function getSession(): Promise<Session> {
  const supabase = createClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error fetching session:', error.message)
      redirect('/login')
    }
    
    if (!session) {
      redirect('/login')
    }
    
    return session
  } catch (error) {
    console.error('Unexpected error fetching session:', error)
    redirect('/login')
  }
}

// Utility function to check if user is authenticated without redirecting
export async function isAuthenticated(): Promise<boolean> {
  const supabase = createClient()
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  } catch (error) {
    console.error('Error checking authentication status:', error)
    return false
  }
}