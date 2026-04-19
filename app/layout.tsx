import type { Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://company-compatibility.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "기업 궁합 테스트",
  description:
    "나와 기업의 궁합을 확인해보세요. 엔터테인먼트 목적의 재미있는 기업 궁합 테스트입니다.",
  openGraph: {
    title: "기업 궁합 테스트",
    description: "나와 기업의 궁합을 확인해보세요.",
    type: "website",
    images: ["/og-default.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "기업 궁합 테스트",
    description: "나와 기업의 궁합을 확인해보세요.",
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6133197353620012"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <main className="flex-1">{children}</main>
        <footer className="py-4 text-center text-xs text-gray-400">
          엔터테인먼트 목적의 콘텐츠입니다 ·{" "}
          <Link href="/policy" className="underline hover:text-gray-600">
            개인정보 처리방침
          </Link>
        </footer>
      </body>
    </html>
  );
}
