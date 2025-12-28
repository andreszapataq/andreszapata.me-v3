import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Section from "@/components/section";
import Now from "@/components/now";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:pl-23 md:pr-0 max-w-[792px]">
        <Hero />

        <Section title="Cosas que he construido">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan malesuada felis,
            vitae gravida arcu porta id. Suspendisse dignissim, lorem et dictum volutpat, lacus justo
            consectetur felis, eu suscipit ipsum erat eget velit. Praesent mattis, mauris sed rhoncus
            facilisis, libero mi finibus magna, vitae ultricies tortor nisl ut neque.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan malesuada felis,
            vitae gravida arcu porta id. Suspendisse dignissim, lorem et dictum volutpat, lacus justo
            consectetur felis, eu suscipit ipsum erat eget velit. Praesent mattis, mauris sed rhoncus
            facilisis, libero mi finibus magna, vitae ultricies tortor nisl ut neque.
          </p>
        </Section>

        <Section title="Cómo pienso">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan malesuada felis,
            vitae gravida arcu porta id. Suspendisse dignissim, lorem et dictum volutpat, lacus justo
            consectetur felis, eu suscipit ipsum erat eget velit. Praesent mattis, mauris sed rhoncus
            facilisis, libero mi finibus magna, vitae ultricies tortor nisl ut neque.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan malesuada felis,
            vitae gravida arcu porta id. Suspendisse dignissim, lorem et dictum volutpat, lacus justo
            consectetur felis, eu suscipit ipsum erat eget velit. Praesent mattis, mauris sed rhoncus
            facilisis, libero mi finibus magna, vitae ultricies tortor nisl ut neque.
          </p>
        </Section>

        <Now />
      </main>
      <Footer />
    </>
  );
}
