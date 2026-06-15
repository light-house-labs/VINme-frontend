"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Check } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => setStatus("success"), 1500);
  };

  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    gsap.fromTo(contentRef.current.children,
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
      id="contact" 
      className="section-editorial"
    >
      <div ref={contentRef} className="container-editorial grid-12 text-left">
        <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:pr-[64px]">
          <div className="label-editorial">
            GET IN TOUCH
          </div>
          <h2 className="heading-editorial">
            Let's talk.
          </h2>
          <p className="paragraph-editorial max-w-[400px]">
            Have questions about the process? Want to talk to a human? Fill out the form and our concierge team will reach out to you shortly.
          </p>

          <div className="mt-[80px] flex flex-col gap-[32px]">
            <div>
              <div className="text-[13px] text-ash font-[600] tracking-[0.1em] uppercase mb-[12px]">Direct Line</div>
              <div className="text-[24px] text-bone-white font-[400]">1 (800) VIN-ME-NOW</div>
            </div>
            <div>
              <div className="text-[13px] text-ash font-[600] tracking-[0.1em] uppercase mb-[12px]">Email</div>
              <div className="text-[24px] text-bone-white font-[400]">concierge@vinme.com</div>
            </div>
          </div>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-7 bg-carbon border border-soot p-[32px] md:p-[64px] mt-16 lg:mt-0">
          <form onSubmit={handleSubmit} className="flex flex-col gap-[48px] text-left">
            <div className="flex flex-col md:flex-row gap-[48px]">
              <div className="flex flex-col gap-[16px] flex-1">
                <label className="text-[13px] font-[600] text-ash tracking-[0.1em] uppercase">Name</label>
                <input required type="text" className="bg-transparent border-b border-soot text-bone-white px-0 py-[16px] focus:outline-none focus:border-signal-amber font-[400] text-[20px] transition-colors rounded-none placeholder:text-ash/30" placeholder="Jane Doe" />
              </div>

              <div className="flex flex-col gap-[16px] flex-1">
                <label className="text-[13px] font-[600] text-ash tracking-[0.1em] uppercase">Phone</label>
                <input required type="tel" className="bg-transparent border-b border-soot text-bone-white px-0 py-[16px] focus:outline-none focus:border-signal-amber font-[400] text-[20px] transition-colors rounded-none placeholder:text-ash/30" placeholder="(555) 123-4567" />
              </div>
            </div>

            <div className="flex flex-col gap-[16px]">
              <label className="text-[13px] font-[600] text-ash tracking-[0.1em] uppercase">Email</label>
              <input required type="email" className="bg-transparent border-b border-soot text-bone-white px-0 py-[16px] focus:outline-none focus:border-signal-amber font-[400] text-[20px] transition-colors rounded-none placeholder:text-ash/30" placeholder="jane@example.com" />
            </div>

            <div className="flex flex-col gap-[16px]">
              <label className="text-[13px] font-[600] text-ash tracking-[0.1em] uppercase">Message</label>
              <textarea required rows={1} className="bg-transparent border-b border-soot text-bone-white px-0 py-[16px] focus:outline-none focus:border-signal-amber font-[400] text-[20px] transition-colors resize-none rounded-none placeholder:text-ash/30" placeholder="How can we help?" />
            </div>

            <button
              type="submit"
              disabled={status !== "idle"}
              className={`btn-editorial group relative mt-[32px] w-full flex items-center justify-center gap-[12px] !py-[24px] !px-8 overflow-hidden ${
                status === "success" 
                  ? "opacity-50 cursor-not-allowed" 
                  : ""
              }`}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out rounded-full z-0" />
              <div className="relative z-10 flex items-center gap-[12px]">
                {status === "idle" && <><span className="mr-[8px] group-hover:text-void-black transition-colors">Submit Inquiry</span> <ArrowRight className="transition-all duration-300 group-hover:translate-x-1 group-hover:text-void-black" size={20} /></>}
                {status === "submitting" && <span className="group-hover:text-void-black transition-colors">Sending...</span>}
                {status === "success" && <><span className="mr-[8px] group-hover:text-void-black transition-colors">Received</span> <Check size={20} className="group-hover:text-void-black transition-colors" /></>}
              </div>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
