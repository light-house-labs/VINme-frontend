"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "What kind of cars do you buy?", a: "We buy almost any make and model, as long as it's year 2005 or newer. We specialize in everyday cars, luxury vehicles, and even exotics." },
    { q: "Do you buy leased cars?", a: "Yes, we regularly buy out leases. We'll handle the payoff process with your leasing company directly." },
    { q: "What if I have a loan on my car?", a: "No problem. We'll pay off your loan and hand you a check for the positive equity." },
    { q: "What if there are title issues?", a: "We can work through most title issues. Please let our team know the specifics and we will guide you." },
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(itemsRef.current,
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
      className="section-editorial"
    >
      <div className="container-editorial grid-12 text-left">
        <div className="col-span-4 md:col-span-8 lg:col-span-10 lg:col-start-2 mb-[64px]">
          <div className="label-editorial">
            FAQ
          </div>
          <h2 className="heading-editorial">
            Frequently asked questions.
          </h2>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-10 lg:col-start-2 flex flex-col">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              ref={(el) => { itemsRef.current[i] = el; }}
              className="border-t border-soot last:border-b border-soot"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-[32px] text-left focus:outline-none group"
              >
                <span className="text-[20px] font-[700] text-bone-white pr-8 tracking-tight group-hover:text-signal-amber transition-colors uppercase">{faq.q}</span>
                <span className="text-signal-amber text-[32px] font-[300] transition-transform duration-500" style={{ transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-[40px] pt-[8px] text-[16px] font-[400] text-ash leading-[1.6] max-w-[800px]">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
