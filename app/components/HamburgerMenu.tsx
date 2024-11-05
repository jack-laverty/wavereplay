'use client';

import { getUsername } from '@/lib/supabase/user';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { LogOut, SquareMenu, List } from "lucide-react"

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
    const username = getUsername();
    if (!username) {
      router.push('/login');
    }
    router.push(`/${username}/dashboard`);
    //TODO: close sidebar
  };

  return (
    <Sheet>
      <SheetTrigger>
      <SquareMenu />
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          
          {/* Dashboard */}
          <SheetDescription>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => Dashboard()}
              >
              <List className="mr-4" />
              Dashboard
            </Button>
          </SheetDescription>
          
          {/* Logout */}
          <SheetDescription>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => Logout()}
              >
              <LogOut className="mr-4" />
              Logout
            </Button>
          </SheetDescription>

        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
