// File: app/layout.js
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import Script from "next/script"; // ✅ Required for dynamic script injection
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Student Portal",
  description: "A secure course advising platform powered by reCAPTCHA v3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ reCAPTCHA v3 Script: Don't use v2's api.js */}
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <NextTopLoader
          color="#FF0444"
          initialPosition={0.08}
          crawlSpeed={800}
          height={4}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 10px #2299DD"
        />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
