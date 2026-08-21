import type { Metadata } from "next";

import GuidePage from "@/components/install/GuidePage";
import { GUIDES } from "@/components/install/guides";

const guide = GUIDES.windows;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: "/install/windows" },
  openGraph: {
    type: "article",
    siteName: "omm",
    url: "/install/windows",
    locale: "en_US",
    title: guide.metaTitle,
    description: guide.metaDescription,
  },
};

export default function WindowsInstallGuide() {
  return <GuidePage guide={guide} />;
}
