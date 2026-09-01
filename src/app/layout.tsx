import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hospital Security Awareness & Phishing Simulation",
  description:
    "Sistem simulasi keamanan informasi, edukasi phishing dan perlindungan data rekam medis pasien untuk unit IT/EDP Rumah Sakit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
