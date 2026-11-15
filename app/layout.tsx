
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Providers from "@/components/Providers";
import AuthHeader from "@/components/AuthHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StayFinder | Find your next escape",
  description: "Discover beautiful places to stay across Sweden.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#faf9f6] font-sans text-stone-900">
        <Providers>
          <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#faf9f6]/95 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-5">
              <Link
                href="/"
                className="text-2xl font-bold tracking-tight text-stone-900"
              >
                Stay<span className="text-emerald-800">Finder.</span>
              </Link>

              <nav className="flex items-center gap-5">
                <Link
                  href="/host/properties/new"
                  className="rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
                >
                  List a stay
                </Link>

                <AuthHeader />
              </nav>
            </div>
          </header>

          {children}

          <footer className="mt-auto border-t border-stone-200 bg-[#f3f1eb]">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-lg font-bold">
                Stay<span className="text-emerald-800">Finder.</span>
              </span>
              <p className="text-sm text-stone-500">
                Discover your next escape across Sweden.
              </p>
              <p className="text-xs text-stone-500">
                © {new Date().getFullYear()} StayFinder
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
