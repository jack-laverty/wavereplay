'use client';

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

import { LogOut } from "lucide-react"

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

  return (
    <Sheet>
      <SheetTrigger>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-menu"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 8h10"/><path d="M7 12h10"/><path d="M7 16h10"/></svg>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>

            {/* Logout */}
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
