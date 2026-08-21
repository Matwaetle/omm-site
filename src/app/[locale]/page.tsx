import { notFound } from "next/navigation";

import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Features from "@/components/Features";
import Runners from "@/components/Runners";
import Install from "@/components/Install";
import Footer from "@/components/Footer";
import { isLocale } from "@/i18n/config";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <Nav locale={locale} />
      <main>
        <Hero locale={locale} />
        <Problem locale={locale} />
        <Features locale={locale} />
        <Runners locale={locale} />
        <Install locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
