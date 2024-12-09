'use client';

import { LogOut, Home } from "lucide-react";
import { getUsername } from '@/lib/supabase/user';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  
  const items = [
    {
      title: "Dashboard",
      type: "action",
      action: () => Dashboard(),
      icon: Home,
    },
    {
      title: "Logout",
      type: "action",
      action: () => Logout(),
      icon: LogOut,
    }
  ]

  const supabase = createClient();
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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button onClick={item.action}>
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
