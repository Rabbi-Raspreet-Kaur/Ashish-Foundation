"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  GraduationCap,
  Heart,
  Users,
  Wrench,
  Stethoscope,
  HandHeart,
  ArrowRight,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { PROGRAMMES } from "@/lib/constants";
import { fetchPublicProgrammes } from "@/lib/supabase/db";
import { type StoredProgramme } from "@/lib/storage";

const iconMap = {
  GraduationCap,
  Heart,
  Users,
  Wrench,
  Stethoscope,
  HandHeart,
};

export default function OurWorkSection() {
  const [programmes, setProgrammes] = useState<StoredProgramme[]>(() =>
    PROGRAMMES.map((p) => ({ ...p, published: true }))
  );

  useEffect(() => {
    let mounted = true;
    fetchPublicProgrammes().then((data) => {
      if (mounted && data && data.length > 0) {
        setProgrammes(data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="our-work"
      className="section-padding bg-offwhite"
      aria-label="Our Work"
    >
      <div className="container-wide mx-auto">
        <SectionHeading
          title="Our Work"
          subtitle="Focused programmes creating real impact in education, healthcare, empowerment and community development."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {programmes.map((programme, i) => {
            const Icon = iconMap[programme.icon as keyof typeof iconMap] || Heart;
            return (
              <ScrollReveal key={programme.id} delay={i * 0.08}>
                <article className="group relative bg-white rounded-2xl overflow-hidden border border-forest/5 hover:border-green/20 transition-all duration-500 hover:shadow-xl hover:shadow-green/5 hover:-translate-y-1.5 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={programme.image}
                      alt={programme.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-forest" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3
                      className="text-xl font-semibold text-forest mb-3"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {programme.title}
                    </h3>
                    <p className="text-sm text-charcoal-light leading-relaxed flex-1 mb-4">
                      {programme.description}
                    </p>
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 text-sm font-medium text-green hover:text-forest transition-colors duration-300 group/link"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </a>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
