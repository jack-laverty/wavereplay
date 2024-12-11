import type { Metadata } from "next";
import "@/app/globals.css";

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/(sidebar)/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { Manrope } from "next/font/google";
import Header from "./header"

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
})

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
    <html lang="en" className={manrope.className}>
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