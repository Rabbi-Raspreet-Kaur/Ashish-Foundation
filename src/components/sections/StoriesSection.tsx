"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, MapPin, Bookmark } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { STORIES } from "@/lib/constants";
import { fetchPublicStories } from "@/lib/supabase/db";

interface StoryItem {
  id: string;
  title: string;
  location: string;
  programme: string;
  image: string;
  tagline: string;
  before: string;
  after: string;
}

export default function StoriesSection() {
  const [stories, setStories] = useState<StoryItem[]>([...STORIES]);

  useEffect(() => {
    let mounted = true;
    fetchPublicStories().then((data) => {
      if (mounted && data && data.length > 0) {
        setStories(data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="stories"
      className="section-padding bg-offwhite"
      aria-label="Stories of Change"
    >
      <div className="container-wide mx-auto">
        <SectionHeading
          title="Stories of Change"
          subtitle="Real stories of transformation — from need to opportunity, from challenge to change."
        />

        <div className="space-y-16 md:space-y-24">
          {stories.map((story, i) => (
            <ScrollReveal key={story.id} delay={0.1}>
              <article
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  i % 2 !== 0 ? "lg:direction-rtl" : ""
                }`}
              >
                {/* Image */}
                <div className={`${i % 2 !== 0 ? "lg:order-2" : ""}`}>
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] img-zoom">
                    <Image
                      src={story.image}
                      alt={`${story.title} — ${story.programme}`}
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/30 to-transparent" />
                    {/* Programme badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 rounded-full text-xs font-medium text-forest">
                        <Bookmark className="w-3 h-3" />
                        {story.programme}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`${i % 2 !== 0 ? "lg:order-1" : ""}`}>
                  <span className="inline-block text-sm font-semibold text-saffron uppercase tracking-wider mb-3">
                    {story.tagline}
                  </span>
                  <h3
                    className="text-2xl md:text-3xl font-bold text-forest mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {story.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-charcoal-light mb-6">
                    <MapPin className="w-3.5 h-3.5 text-green" />
                    <span>{story.location}</span>
                  </div>

                  {/* Before/After */}
                  <div className="space-y-4 mb-8">
                    <div className="relative pl-6 border-l-2 border-forest/10">
                      <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-terracotta -translate-x-[5px]" />
                      <p className="text-sm text-charcoal-light leading-relaxed italic">
                        &quot;{story.before}&quot;
                      </p>
                    </div>
                    <div className="text-center text-forest/30 text-lg">↓</div>
                    <div className="relative pl-6 border-l-2 border-green/30">
                      <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-green -translate-x-[5px]" />
                      <p className="text-sm text-charcoal leading-relaxed">
                        &quot;{story.after}&quot;
                      </p>
                    </div>
                  </div>

                  <button className="inline-flex items-center gap-2 text-sm font-semibold text-green hover:text-forest transition-colors duration-300 group">
                    Read Full Story
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
