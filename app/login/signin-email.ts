import { createClient } from '@/lib/supabase/server'

export async function signInWithEmail() {
  let supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'user@example.com',
    password: 'password123',
  });
}
