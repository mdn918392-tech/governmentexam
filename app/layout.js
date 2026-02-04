import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Government Exam – Latest Govt Jobs, Results, Admit Cards 2025",
  description:
    "GovernmentExam.online – Get the latest government job alerts, exam notifications, results, admit cards, and syllabus updates.",
  keywords: [
    "Government Result",
    "Govt Jobs 2025",
    "SSC Jobs",
    "UPSC Jobs",
    "Railway Jobs",
    "Bank Jobs",
    "Police Jobs",
    "Teaching Jobs",
    "Exam Results",
    "Admit Cards",
    "Answer Keys",
    "Syllabus",
    "Admission",
  ],
  alternates: {
    canonical: "https://governmentexam.online/",
  },
  verification: {
    google: "-QD64h0qJ-7kW15LvtnCiozoc0zHyIYuybZ8YLBaB_g",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8438144860540330"
          crossOrigin="anonymous"
        />

        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MRWG0TTSTS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MRWG0TTSTS');
          `}
        </Script>

        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
