import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "عواطلي | 3WATLY — منصة تحليلات سوق العمل والمسار المهني في مصر",
  description: "افهم متطلبات سوق العمل المصري، حدد فجوات مهاراتك وسيرتك الذاتية، واكتشف وظائف تناسبك بدقة عبر تحليلات بيانات حقيقية.",
  keywords: ["عواطلي", "3WATLY", "وظائف مصر", "تحليلات سوق العمل", "سيرة ذاتية ATS", "Egypt Tech Jobs", "Career Intelligence Egypt"],
  authors: [{ name: "فريق عواطلي | 3WATLY" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${cairo.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/logo.png" sizes="any" />
        <link rel="shortcut icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="antialiased min-h-screen bg-[#F8FAFC] dark:bg-[#060913] text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white font-sans">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
