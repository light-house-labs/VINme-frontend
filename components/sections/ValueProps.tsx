"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ValueProps() {
  const props = [
    { label: "CONVENIENT", title: "We come to you.", desc: "No need to visit a dealership and waste your weekend negotiating. Sell from your home." },
    { label: "FAST", title: "Same day pay.", desc: "Our streamlined process means you walk away with a check in hand the same day." },
    { label: "FAIR", title: "Data-backed.", desc: "Our AI engine analyzes millions of data points to offer you the most competitive price." },
    { label: "HONEST", title: "Zero hidden fees.", desc: "The offer you see is the money you get. We don't believe in bait-and-switch tactics." },
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(itemsRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      }
    );
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="section-editorial"
    >
      <div className="container-editorial grid-12">
        {props.map((prop, i) => (
          <div 
            key={i} 
            ref={(el) => { itemsRef.current[i] = el; }}
            className="col-span-4 md:col-span-3 flex flex-col text-left group"
          >
            <div className="w-full h-[1px] bg-soot mb-[32px] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-signal-amber scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
            </div>
            <div className="label-editorial mb-[16px]">
              {prop.label}
            </div>
            <h3 className="text-[20px] font-[700] text-bone-white mb-[16px] tracking-tight uppercase">
              {prop.title}
            </h3>
            <p className="paragraph-editorial mb-0 text-[14px]">
              {prop.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
