import { createClient } from '@/lib/supabase/client'

export async function signInWithEmail() {
  let supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'user@example.com',
    password: 'password123',
  });
}
