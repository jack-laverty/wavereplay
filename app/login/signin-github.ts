import { createClient } from '@/lib/supabase/client'

export async function signInWithGithub() {
  let supabase = createClient()
  await supabase.auth.signInWithOAuth({
    provider:'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
}

