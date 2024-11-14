'use client';

import { getUsername } from '@/lib/supabase/user';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Menu, AppWindow } from "lucide-react";

const supabase = createClient();

export default function HamburgerMenu() {
  const router = useRouter();

  const Logout = async () => {
    console.log('Signing out');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
      return;
    }
    router.push('/login');
  };

  const Dashboard = async () => {
    const username = await getUsername();
      if (!username) {
        router.push('/login')
        return;
      }
      router.push(`/${username}/dashboard`);
  };

  return (
    <Sheet>
      <SheetTrigger>
        <Menu size={36} />
      </SheetTrigger>
      <SheetContent side="left" className="w-[220px]">
        <SheetHeader>
          <SheetTitle className="pb-4 flex justify-center">
            <img src="/wavereplay.svg" alt="Logo" className="w-20 md:w-24" />
          </SheetTitle>
  
          {/* Dashboard Button */}
          <SheetDescription>
            <SheetClose asChild>
              <Button
                variant="secondary"
                className="w-44"  // Fixed width
                onClick={Dashboard}
                size="sm"
              >
                <AppWindow className="mr-4" />
                Dashboard
              </Button>
            </SheetClose>
          </SheetDescription>
  
          {/* Logout Button */}
          <SheetDescription>
            <SheetClose asChild>
              <Button
                variant="secondary"
                className="w-44"  // Fixed width
                onClick={Logout}
                size="sm"
              >
                <LogOut className="mr-4" />
                Logout
              </Button>
            </SheetClose>
          </SheetDescription>
  
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
  
}
