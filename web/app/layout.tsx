import type { Metadata } from "next";
import { ThemeProvider } from "../components/theme-provider";
import { Navbar } from "../components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://backendevolution.com"),
  title: {
    default: "Backend Evolution | Junior to CTO",
    template: "%s | Backend Evolution",
  },
  description:
    "I build high-performance distributed systems. Documenting the evolution of backend architecture from raw code to enterprise-grade fault tolerance.",
  keywords: [
    "System Architecture",
    "Distributed Systems",
    "Backend Development",
    "High Performance",
    "Node.js",
    "C++",
    "gRPC",
  ],
  authors: [{ name: "Seyed Mostafa Baghi" }],
  creator: "Seyed Mostafa Baghi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://backendevolution.com",
    title: "Backend Evolution | Junior to CTO",
    description:
      "I build high-performance distributed systems. Documenting the evolution of backend architecture.",
    siteName: "Backend Evolution",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Backend Evolution Architecture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Backend Evolution | Junior to CTO",
    description: "High-Performance Distributed Systems & Architecture",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Global JSON-LD for the entire site
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Backend Evolution",
    url: "https://backendevolution.com",
    description: "High-Performance Distributed Systems & Architecture",
    author: {
      "@type": "Person",
      name: "Seyed Mostafa Baghi",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-slate-900 dark:bg-[#121212] dark:text-[#E0E0E0] antialiased selection:bg-[#6200EA]/30 transition-colors duration-300">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar />
          <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
