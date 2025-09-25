'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Páginas que não devem ter o Header
  const authPages = ['/login', '/cadastro', '/esqueci-senha'];
  const isAuthPage = authPages.includes(pathname);

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        {!isAuthPage && <Header />}
        {!isAuthPage ? (
          <main className="main-content">
            {children}
          </main>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
