import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luméa Atelier — Jewelry That Moves With Your Light",
  description: "Discover Luméa Atelier’s debut collection: three quietly luminous pieces made for daily elegance, gifting, and unforgettable moments.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
