"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function Founder() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current || !imageRef.current) return;

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
            start: "top 70%",
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
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      }
    );

    gsap.fromTo(imageRef.current,
      { scale: 1.1, y: -20 },
      {
        scale: 1,
        y: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );

  }, []);

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="section-editorial border-t border-soot overflow-hidden"
    >
      <div className="container-editorial grid-12">
        {/* Text Column */}
        <div ref={textRef} className="col-span-4 md:col-span-8 lg:col-span-5 flex flex-col justify-center text-left pt-[64px] lg:pt-[120px]">
          <div className="label-editorial reveal-element">
            ABOUT US
          </div>
          <h2 className="heading-editorial">
            Lifelong automotive enthusiast and buyer.
          </h2>
          <p className="paragraph-editorial reveal-element">
            For over a decade, we've built VINme on the principle of transparency. We believe selling a car shouldn't be a battle of attrition or a game of hidden fees. Our AI-powered valuation ensures you get a fair, data-backed offer in minutes, while our dedicated team handles the rest.
          </p>
          
          <div className="mb-[64px] reveal-element">
            <span className="font-['Brush_Script_MT',cursive] text-[48px] text-bone-white opacity-80 italic">
              Ori Filhart
            </span>
          </div>

          <Link href="#about" className="inline-block group reveal-element">
            <div className="inline-flex items-center gap-[12px] text-[16px] font-[600] text-signal-amber transition-colors uppercase tracking-[0.1em]">
              Our Story 
              <div className="transition-transform duration-300 ease-out group-hover:translate-x-2">
                <ArrowRight size={20} />
              </div>
            </div>
          </Link>
        </div>

        {/* Image Column */}
        <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7 w-full min-h-[500px] lg:min-h-[700px] relative mt-[64px] lg:mt-0 overflow-hidden border border-soot">
          <Image
            ref={imageRef}
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"
            alt="Ori Filhart, Founder of VINme"
            fill
            className="object-cover object-[center_top] grayscale-[30%] rounded-none"
          />
        </div>
      </div>
    </section>
  );
}
