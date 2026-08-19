import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Variable Archivo: wght 100–900 plus the wdth axis (62–125) so `.text-display`
// can set `font-variation-settings: "wdth" 90`. Weights actually used: 400–700.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

// Self-hosted full-glyph build (OFL, src/fonts/OFL.txt): the Google-served
// latin subset lacks the box-drawing block (U+2500–257F), so the terminal
// tables fell back to a different-width mono and their rules misaligned.
const jetbrainsMono = localFont({
  variable: "--font-jetbrains",
  src: [
    { path: "../fonts/JetBrainsMono-Regular.woff2", weight: "400" },
    { path: "../fonts/JetBrainsMono-Medium.woff2", weight: "500" },
    { path: "../fonts/JetBrainsMono-Bold.woff2", weight: "700" },
  ],
  display: "swap",
});

const title = "omm — Open source Model Manager";
const description =
  "omm is an apt/brew-style package manager for local LLMs (GGUF). It installs models into a central hub, links them into seven local AI runners automatically, and can recommend a model that fits your hardware.";

export const metadata: Metadata = {
  metadataBase: new URL("https://omm-site-sage.vercel.app"),
  title,
  description,
  applicationName: "omm",
  openGraph: {
    type: "website",
    siteName: "omm",
    url: "/",
    locale: "en_US",
    title,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col">{children}</body>
    </html>
  );
}
