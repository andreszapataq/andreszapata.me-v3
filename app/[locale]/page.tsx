import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Now from "@/components/now";
import Footer from "@/components/footer";
import BuiltSection from "@/components/built-section";
import ThinkingSection from "@/components/thinking-section";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main className="px-6 md:pl-23 md:pr-0 max-w-[792px]">
        <Hero />
        <BuiltSection />
        <ThinkingSection />
        <Now />
      </main>
      <Footer />
    </>
  );
}

