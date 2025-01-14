"use client";

import localFont from "next/font/local";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "../components/ui/toaster";
import AuthProvider from "../context/AuthProvider";
import FloatingChatbot from "../components/chatBot/chatBot";
import Navbar from "@/components/navbar/Navbar";
import ClientOnly from "@/components/ClientOnly";
import { usePathname } from "next/navigation";
import { metadata } from "./metadata"; // Import metadata

const ArchivoBlack = localFont({
  src: "./fonts/ArchivoBlack-Regular.ttf",
  variable: "--font-archivo",
  weight: "100 900",
});
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${ArchivoBlack.variable} antialiased`}
        >
          <ClientOnly>
            {pathname !== "/sign-in" && <Navbar />}
          </ClientOnly>

          {children}
          <FloatingChatbot />
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
