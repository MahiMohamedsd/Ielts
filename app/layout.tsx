import type { Metadata } from "next";
import { Poppins, Lora } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { LanguageProvider } from "@/lib/i18n";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  fallback: ["Segoe UI", "Arial", "sans-serif"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  title: "The Algerian's IELTS Playbook — Companion Practice",
  description:
    "Free companion practice site for The Algerian's IELTS Playbook: listen, read, write, and drill vocabulary with instant auto-scoring.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} ${lora.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <LanguageProvider>
          <Header />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
