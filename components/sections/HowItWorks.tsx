"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const steps = [
    { num: "01", title: "Tell Us", desc: "Enter your car's details online. It takes less than two minutes." },
    { num: "02", title: "Get an Offer", desc: "Receive a real cash offer instantly. No estimations, just real data." },
    { num: "03", title: "Complete the Deal", desc: "We pick up your car for free and hand you a check on the spot." },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(stepsRef.current, 
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="section-editorial">
      <div className="container-editorial">
        <div className="grid-12 border-t border-soot">
          {steps.map((step, i) => (
            <div 
              key={i} 
              ref={(el) => {
                stepsRef.current[i] = el;
              }}
              className="col-span-4 border-b border-soot md:border-b-0 md:border-r border-soot last:border-r-0 relative py-[64px] px-[24px] lg:px-[48px] flex flex-col justify-center overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-signal-amber scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-20" />
              <span className="absolute -left-[20px] top-1/2 -translate-y-1/2 text-[140px] font-[800] text-gunmetal select-none pointer-events-none z-0 tracking-[-0.05em] leading-none opacity-50">
                {step.num}
              </span>
              <div className="relative z-10 text-left">
                <div className="label-editorial">
                  STEP {step.num}
                </div>
                <h3 className="text-[24px] font-[700] text-bone-white mb-[16px] tracking-tight uppercase">
                  {step.title}
                </h3>
                <p className="paragraph-editorial mb-0 text-[14px]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
