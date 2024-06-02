import type { Metadata } from "next";
import "./globals.css";
import 'typeface-manrope';

import Header from "./components/Header";
import ConditionalHeaderWrapper from "./components/ConditionalHeaderWrapper";

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
      <body className="bg-gray-100">
        <ConditionalHeaderWrapper>
          <Header />
        </ConditionalHeaderWrapper>
        <main>{children}</main>
      </body>
    </html>
  );
}