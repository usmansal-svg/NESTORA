import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Instrument_Serif({ variable: "--font-display", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const urdu = Noto_Nastaliq_Urdu({ variable: "--font-urdu", subsets: ["arabic"], weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "NESTORA — Your Community. Everything Connected.",
  description: "The operating system for residential communities. Demo: Ocean Heights, DHA Karachi.",
};

export const viewport: Viewport = { themeColor: "#0f3d33", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var q=new URLSearchParams(location.search).get("theme");var t=q||(JSON.parse(localStorage.getItem("nestora-demo-v1")||"{}").state||{}).theme;if(t==="emaar")document.documentElement.dataset.theme="emaar"}catch(e){}` }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${urdu.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
