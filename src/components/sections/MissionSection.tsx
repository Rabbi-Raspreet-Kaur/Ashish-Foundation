"use client";

import { BookOpen, Scale, Sparkles, Shield } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { VALUES } from "@/lib/constants";

const iconMap = {
  BookOpen,
  Scale,
  Sparkles,
  Shield,
};

export default function MissionSection() {
  return (
    <section
      id="mission"
      className="section-padding bg-cream"
      aria-label="Our Mission"
    >
      <div className="container-narrow mx-auto">
        {/* Editorial Statement */}
        <ScrollReveal className="text-center mb-16 md:mb-20">
          <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-green border border-green/20 rounded-full bg-green/5 mb-6">
            Our Mission
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-forest leading-[1.1] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Every Life Deserves
            <br />
            an Opportunity
          </h2>
          <p className="text-lg md:text-xl text-charcoal-light max-w-xl mx-auto leading-relaxed">
            Change begins when opportunity reaches those who need it most.
          </p>
          <div className="mt-8 h-1 w-16 rounded-full bg-saffron mx-auto" />
        </ScrollReveal>

        {/* Four Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {VALUES.map((value, i) => {
            const Icon = iconMap[value.icon as keyof typeof iconMap];
            return (
              <ScrollReveal key={value.title} delay={i * 0.1}>
                <div className="group relative bg-white rounded-2xl p-8 text-center border border-forest/5 hover:border-green/20 transition-all duration-500 hover:shadow-lg hover:shadow-green/5 hover:-translate-y-1">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-forest/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-green/10 transition-colors duration-500">
                    <Icon className="w-7 h-7 text-forest group-hover:text-green transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-forest mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                    {value.title}
                  </h3>
                  <p className="text-sm text-charcoal-light leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
