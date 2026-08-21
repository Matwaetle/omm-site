import type { Metadata } from "next";

import GuidePage from "@/components/install/GuidePage";
import { GUIDES } from "@/components/install/guides";

const guide = GUIDES.linux;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: "/install/linux" },
  openGraph: {
    type: "article",
    siteName: "omm",
    url: "/install/linux",
    locale: "en_US",
    title: guide.metaTitle,
    description: guide.metaDescription,
  },
};

export default function LinuxInstallGuide() {
  return <GuidePage guide={guide} />;
}
