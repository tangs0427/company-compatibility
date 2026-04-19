import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "기업 궁합 테스트",
  description: "나와 기업의 궁합을 확인해보세요! 엔터테인먼트 목적의 재미있는 궁합 테스트입니다.",
  openGraph: {
    title: "기업 궁합 테스트",
    description: "나와 기업의 궁합을 확인해보세요!",
    type: "website",
    images: ["/og-default.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6133197353620012"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <main className="flex-1">{children}</main>
        <footer className="py-4 text-center text-xs text-gray-400">
          엔터테인먼트 목적의 콘텐츠입니다 ·{" "}
          <a href="/policy" className="underline hover:text-gray-600">
            개인정보 처리방침
          </a>
        </footer>
      </body>
    </html>
  );
}
