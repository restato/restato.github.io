import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/Providers';
import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Toaster } from "react-hot-toast";
import { ColorModeScript } from '@chakra-ui/react';
import { theme } from '@/lib/theme';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
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
    <html lang="ko">
      <body
        className={`${inter.variable} ${fredoka.variable} antialiased`}
      >
        <ColorModeScript initialColorMode={theme.config?.initialColorMode || 'light'} />
        <Providers>
          <LanguageProvider>
            <Header />
            <main style={{ minHeight: 'calc(100vh - 80px)' }}>
              {children}
            </main>
            <Toaster position="top-center" />
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
