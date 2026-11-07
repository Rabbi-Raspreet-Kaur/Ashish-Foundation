"use client";

import { Search, BookOpen, Heart, Wrench, Zap, Sun } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { JOURNEY_STEPS } from "@/lib/constants";

const iconMap = { Search, BookOpen, Heart, Wrench, Zap, Sun };

export default function JourneySection() {
  return (
    <section
      id="journey"
      className="section-padding bg-cream"
      aria-label="One Life One Journey"
    >
      <div className="container-narrow mx-auto">
        <ScrollReveal className="text-center mb-16 md:mb-20">
          <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-green border border-green/20 rounded-full bg-green/5 mb-6">
            The Journey
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-forest leading-tight tracking-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            One Life. One Journey.
          </h2>
          <p className="text-lg text-charcoal-light max-w-xl mx-auto leading-relaxed">
            Meaningful social change is not a single event — it is a journey of
            discovery, growth and empowerment.
          </p>
          <div className="mt-6 h-1 w-16 rounded-full bg-saffron mx-auto" />
        </ScrollReveal>

        {/* Journey Path */}
        <div className="relative">
          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-4">
            {JOURNEY_STEPS.map((step, i) => {
              const Icon = iconMap[step.icon as keyof typeof iconMap];
              const isLast = i === JOURNEY_STEPS.length - 1;
              return (
                <ScrollReveal key={step.title} delay={i * 0.12}>
                  <div className="relative flex flex-col items-center text-center group">
                    {/* Step number */}
                    <div className="absolute -top-3 right-2 lg:right-auto lg:-top-2 lg:left-1/2 lg:-translate-x-1/2 w-6 h-6 rounded-full bg-saffron/10 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-saffron">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Icon circle */}
                    <div
                      className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 ${
                        isLast
                          ? "bg-saffron text-white shadow-lg shadow-saffron/20"
                          : "bg-white border-2 border-forest/10 text-forest group-hover:border-green group-hover:text-green"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Arrow (mobile/tablet) */}
                    <div className="hidden sm:block lg:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 text-forest/20">
                      ↓
                    </div>

                    <h3 className="text-base font-semibold text-forest mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-charcoal-light leading-relaxed max-w-[160px]">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
