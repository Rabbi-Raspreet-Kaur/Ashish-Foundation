"use client";

import { useState, useEffect } from "react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { IMPACT_STATS } from "@/lib/constants";
import { fetchPublicImpactStats } from "@/lib/supabase/db";
import { type StoredImpactStat } from "@/lib/storage";
import { Users, Home, Lightbulb, HeartHandshake } from "lucide-react";

const icons = [Users, Home, Lightbulb, HeartHandshake];

export default function ImpactSection() {
  const [stats, setStats] = useState<StoredImpactStat[]>(() =>
    IMPACT_STATS.map((s, idx) => ({
      id: "impact-" + (idx + 1),
      label: s.label,
      value: s.value,
      suffix: s.suffix,
      verified: true,
    }))
  );

  useEffect(() => {
    let mounted = true;
    fetchPublicImpactStats().then((data) => {
      if (mounted && data && data.length > 0) {
        setStats(data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="impact"
      className="relative section-padding bg-forest overflow-hidden"
      aria-label="Our Impact"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-green blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-saffron blur-3xl" />
      </div>

      <div className="container-narrow mx-auto relative z-10">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-saffron border border-saffron/30 rounded-full bg-saffron/10 mb-6">
            Our Impact
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Making a Difference
          </h2>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            Together, we are creating lasting impact in communities across
            Ayodhya and beyond.
          </p>
          <div className="mt-6 h-1 w-16 rounded-full bg-saffron mx-auto" />
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
          {stats.map((stat, i) => {
            const Icon = icons[i % icons.length];
            return (
              <ScrollReveal key={stat.id || stat.label} delay={i * 0.1}>
                <div className="text-center group">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-saffron/20 transition-colors duration-500">
                    <Icon className="w-6 h-6 text-saffron" />
                  </div>
                  <div
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      duration={2500}
                    />
                  </div>
                  <p className="text-sm md:text-base text-white/70 font-medium">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Verified Accuracy Tag */}
        <ScrollReveal delay={0.4}>
          <p className="text-center text-xs text-white/50 italic max-w-md mx-auto">
            Figures represent verified community outreach data from Ashish Foundation initiatives.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
