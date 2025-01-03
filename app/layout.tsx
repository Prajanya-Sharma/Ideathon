import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "../components/ui/toaster";
import AuthProvider from '../context/AuthProvider';
import StoreProvider from "../context/StoreProvider";
import SignOutButton from "../components/signOutButton";
import FloatingChatbot from "../components/chatBot/chatBot";

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

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoreProvider>
         <AuthProvider>
           <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            {children}
            <FloatingChatbot />
            <SignOutButton />
            <Toaster />
           </body>
        </AuthProvider>
      </StoreProvider>
    </html>
  );
}
