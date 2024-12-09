import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SidebarTrigger } from "@/components/ui/sidebar"

export default async function Header() {

  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <header className="flex flex-row md:h-20 p-2 items-center justify-between relative">
      <SidebarTrigger />
      <div className="flex justify-center items-center">
        <img src="/wavereplay.svg" alt="Logo" className="w-20 md:w-24" />
      </div>
      <Avatar>
        <AvatarImage src={data.user.user_metadata.avatar_url}  />
        <AvatarFallback>UN</AvatarFallback>
      </Avatar>
    </header>
  )
}