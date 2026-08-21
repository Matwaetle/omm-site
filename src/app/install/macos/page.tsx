import type { Metadata } from "next";

import GuidePage from "@/components/install/GuidePage";
import { GUIDES } from "@/components/install/guides";

const guide = GUIDES.macos;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: "/install/macos" },
  openGraph: {
    type: "article",
    siteName: "omm",
    url: "/install/macos",
    locale: "en_US",
    title: guide.metaTitle,
    description: guide.metaDescription,
  },
};

export default function MacosInstallGuide() {
  return <GuidePage guide={guide} />;
}
