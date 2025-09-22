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
import { WebVitals } from '@/components/WebVitals';
import { GA_TRACKING_ID } from '@/lib/gtag';
import { generateMetadata, defaultSEO } from '@/lib/metadata';
import Script from 'next/script';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = generateMetadata(defaultSEO, 'ko');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* SEO Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
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
        
        {/* Structured Data */}
        <Script id="structured-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "럭키 드로우 게임",
              "alternateName": "Lucky Draw Games",
              "url": "https://restato.github.io",
              "description": "온라인에서 즐기는 재미있고 공정한 랜덤 게임들! 룰렛, 빙고, 복권, 주사위, 카드 게임 등 다양한 게임을 무료로 플레이하세요.",
              "inLanguage": ["ko", "en", "ja", "zh", "es", "fr", "de", "ru", "hi"],
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://restato.github.io/games/{search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Restato Games",
                "url": "https://restato.github.io"
              }
            }
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${fredoka.variable} antialiased`}
      >
        <ColorModeScript initialColorMode={theme.config?.initialColorMode || 'light'} />
        <Providers>
          <LanguageProvider>
            <GoogleAnalytics />
            <WebVitals />
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
