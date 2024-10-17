import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import HamburgerMenu from "./HamburgerMenu";
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Header() {

  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <header>
      <header className="flex flex-row md:h-24 p-4 items-center justify-between relative">
         <div className="flex justify-start items-center">
           <HamburgerMenu />
         </div>
         <div className="flex justify-center items-center">
           <img src="/wavereplay.svg" alt="Logo" className="w-20 md:w-24" />
         </div>
         <div className="flex justify-end items-center">
         <Avatar>
            <AvatarImage src={data.user.user_metadata.avatar_url}  />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
         </div>
       </header>
    </header>
  )
}