import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Variable Archivo: wght 100–900 plus the wdth axis (62–125) so `.text-display`
// can set `font-variation-settings: "wdth" 90`. Weights actually used: 400–700.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const title = "omm — Open source Model Manager";
const description =
  "omm is an apt/brew-style package manager for local LLMs (GGUF). It installs models into a central hub, links them into seven local AI runners automatically, and can recommend a model that fits your hardware.";

export const metadata: Metadata = {
  metadataBase: new URL("https://omm-site.vercel.app"),
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
