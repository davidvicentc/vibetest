import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VIBES Perfumes",
  description: "Mini-market de perfumes con UI moderna",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-brand-layer relative`}
      >
        <div className="bg-blob-1" aria-hidden />
        <div className="bg-blob-2" aria-hidden />
        <header className="backdrop-blur supports-[backdrop-filter]:bg-white/40 bg-white/70 dark:bg-neutral-950/70 sticky top-0 z-20 border-b border-white/30">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-brand ring-4 ring-brand/20" />
              <span className="text-sm font-semibold tracking-wide text-brand">VIBES Perfumes</span>
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link className="nav-link" href="/products">Productos</Link>
              <Link className="nav-cta" href="/admin/products">Admin</Link>
            </div>
          </nav>
        </header>
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
