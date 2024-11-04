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

import { LogOut, SquareMenu } from "lucide-react"

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
      <SquareMenu />
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
