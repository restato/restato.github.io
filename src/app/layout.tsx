import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lucky Draw Games - Fun Random Games",
  description: "Fun and fair random games for everyone. Roulette, Bingo, Lottery, Dice, Cards and more!",
  keywords: "roulette, bingo, lottery, dice, random games, lucky draw, raffle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100`}
      >
        <LanguageProvider>
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster position="top-center" />
        </LanguageProvider>
      </body>
    </html>
  );
}
