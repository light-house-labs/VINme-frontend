"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const features = [
    { title: "White Glove Service", desc: "Our customer service is unmatched. We handle the paperwork, the transport, and the headaches so you don't have to." },
    { title: "Established Buyers", desc: "We've been in the industry for years, establishing trust with thousands of satisfied sellers nationwide." },
    { title: "Guaranteed Offers", desc: "Our offers are rock solid. No last-minute price drops or negotiations if the car matches your initial description." },
    { title: "Market Competitive", desc: "We constantly monitor real-time market conditions to ensure our offers remain highly competitive and fair." },
    { title: "We Come to You", desc: "We meet you at your home or office. You never have to step foot in a dealership or deal with salespeople." },
    { title: "Complimentary Pickup", desc: "Towing and pickup are completely free. We handle all logistics from your driveway to our facilities." },
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    if (headingRef.current) {
      const split = new SplitType(headingRef.current, { types: 'lines,words' });
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
            start: "top 80%",
          }
        }
      );
    }

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
      <div className="container-editorial text-left">
        <div className="mb-[120px]">
          <div className="label-editorial">
            SIX REASONS
          </div>
          <h2 ref={headingRef} className="heading-editorial max-w-[800px]">
            Why VINme is the premier choice for selling your vehicle.
          </h2>
        </div>

        <div className="grid-12">
          {features.map((feature, i) => (
            <div 
              key={i} 
              ref={(el) => { itemsRef.current[i] = el; }}
              className="col-span-4 flex flex-col text-left mb-16"
            >
              <div className="w-full h-[1px] bg-soot mb-[32px] relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-signal-amber scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
              </div>
              <h3 className="text-[20px] font-[700] text-bone-white mb-[16px] tracking-tight uppercase">
                {feature.title}
              </h3>
              <p className="paragraph-editorial mb-0 text-[14px]">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
