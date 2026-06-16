import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Founder from "@/components/sections/Founder";
import ValueProps from "@/components/sections/ValueProps";
import DealersBand from "@/components/sections/DealersBand";
import Features from "@/components/sections/Features";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import ScrollVelocity from "@/components/ui/ScrollVelocity";
import TextReveal from "@/components/ui/TextReveal";
import { MagnetLines } from "@/components/ui/MagnetLines";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <ScrollVelocity />
      <HowItWorks />
      <Founder />
      <ValueProps />
      <DealersBand />
      <TextReveal text="Real-time market analytics meeting seamless transaction logic. We bypass dealership overhead and negotiations to deliver guaranteed offers backed by millions of data points. Simple. Fair. Instant." />
      <Features />
      <div className="w-full py-12 flex items-center justify-center bg-void-black overflow-hidden border-y border-soot/30 text-ash/30 hover:text-signal-amber/60 transition-colors duration-500 select-none">
        <MagnetLines 
          rows={3}
          columns={24}
          containerSize="100%"
          lineColor="currentColor"
          lineWidth="3px"
          lineHeight="32px"
          baseAngle={0}
          className="w-full h-[110px]"
        />
      </div>
      <FAQ />
      <div className="w-full py-12 flex items-center justify-center bg-void-black overflow-hidden border-y border-soot/30 text-ash/30 hover:text-signal-amber/60 transition-colors duration-500 select-none">
        <MagnetLines 
          rows={3}
          columns={24}
          containerSize="100%"
          lineColor="currentColor"
          lineWidth="3px"
          lineHeight="32px"
          baseAngle={0}
          className="w-full h-[110px]"
        />
      </div>
      <Contact />
    </main>
  );
}
