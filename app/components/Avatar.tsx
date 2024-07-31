
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Avatar() {

  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <img 
      src={data.user.user_metadata.avatar_url} 
      alt="User Avatar" 
      className="w-10 h-10 md:w-16 md:h-16 rounded-full border-2" 
      style={{ borderColor: '#d3d3d3' }} 
    />
  )
}
