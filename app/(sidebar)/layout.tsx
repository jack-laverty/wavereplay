import type { Metadata } from "next";
import "@/app/globals.css";
import 'typeface-manrope';

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import Header from "./header"

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
        <SidebarProvider defaultOpen={false}>
          <AppSidebar />
          <main className="w-full bg-slate-200">
            <Header />
            {children}
          </main>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}