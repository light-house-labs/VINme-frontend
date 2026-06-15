"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function DealersBand() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current || !textRef.current) return;

    // Parallax background
    gsap.fromTo(bgRef.current,
      { y: "-10%" },
      {
        y: "10%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );

    // Text Reveal
    const heading = textRef.current.querySelector('h2');
    if (heading) {
      const split = new SplitType(heading, { types: 'lines,words' });
      gsap.fromTo(split.words,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );
    }

    gsap.fromTo(textRef.current.querySelectorAll('.reveal-element'),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%"
        }
      }
    );
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="dealers" 
      className="relative min-h-[800px] flex items-center border-t border-b border-soot overflow-hidden bg-void-black section-editorial !px-0"
    >
      <div className="absolute inset-0 z-0">
        <Image
          ref={bgRef}
          src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop"
          alt="Bright Cars"
          fill
          className="object-cover opacity-[0.3] grayscale-[50%] rounded-none scale-[1.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void-black via-void-black/80 to-transparent" />
      </div>

      <div ref={textRef} className="container-editorial w-full px-[24px] md:px-[64px] lg:px-[120px] relative z-10 text-left">
        <div className="max-w-[800px]">
          <div className="label-editorial mb-[32px] reveal-element">
            FOR DEALERS
          </div>
          <h2 className="text-[56px] md:text-[80px] lg:text-[104px] font-[800] text-bone-white leading-[0.9] tracking-[-0.03em] whitespace-pre-line mb-[48px] text-left">
            Dealers & Brokers.{"\n"}We buy trades.
          </h2>
          <p className="paragraph-editorial max-w-[600px] mb-[80px] reveal-element">
            We buy trades, quickly and easily. Just send us the VIN, miles, and condition. Our dedicated dealer team provides rapid valuation and fast funding so you can close the deal.
          </p>
          <div className="reveal-element">
            <a
              href="#contact"
              className="magnetic-button btn-editorial gap-[12px] group"
            >
              Let's Talk 
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={20} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
