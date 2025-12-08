import type { Metadata, Viewport } from "next";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import AuthGuard from "@/components/AuthGuard";
import ConditionalFooter from "@/components/ConditionalFooter";
import ToastProvider from "@/components/ToastProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "SkripsiMate — Mentoring & Layanan Mahasiswa",
  description:
    "Platform layanan mahasiswa (pendampingan skripsi, olah data dibimbing, proofreading, PPT sidang).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#fafafa] text-black antialiased overflow-x-hidden">
        <ToastProvider>
          <ConditionalNavbar />
          <main className="min-h-[calc(100vh-64px)]">
            <AuthGuard>{children}</AuthGuard>
          </main>
          <ConditionalFooter />
        </ToastProvider>
      </body>
    </html>
  );
}
