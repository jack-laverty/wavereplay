import type { Metadata } from "next";
import "@/app/globals.css";
import 'typeface-manrope';

import { Toaster } from "@/components/ui/toaster"

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
        <main className="w-full bg-slate-200">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}