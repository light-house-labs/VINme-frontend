import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Founder from "@/components/sections/Founder";
import ValueProps from "@/components/sections/ValueProps";
import DealersBand from "@/components/sections/DealersBand";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <HowItWorks />
      <Founder />
      <ValueProps />
      <DealersBand />
      <Features />
      <Testimonials />
      <FAQ />
      <Contact />
    </main>
  );
}
