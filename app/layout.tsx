import type { Metadata } from "next";
import "./globals.css";
import 'typeface-manrope';

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"

export const metadata: Metadata = {
  title: "wavereplay",
  description: "Surf Video Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full bg-slate-200">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}