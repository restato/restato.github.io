import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/Providers';
import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Toaster } from "react-hot-toast";
import { ColorModeScript } from '@chakra-ui/react';
import { theme } from '@/lib/theme';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { GA_TRACKING_ID } from '@/lib/gtag';
import Script from 'next/script';

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
  verification: {
    google: "0GLTtjarMTr8NsaJaP-z0tbHPycvu_rOoQykr81BL0o",
    other: {
      "naver-site-verification": "8d89472cc05500529db6e589eb04fb89456800e4",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Google Analytics */}
        {GA_TRACKING_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${inter.variable} ${fredoka.variable} antialiased`}
      >
        <ColorModeScript initialColorMode={theme.config?.initialColorMode || 'light'} />
        <Providers>
          <LanguageProvider>
            <GoogleAnalytics />
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
