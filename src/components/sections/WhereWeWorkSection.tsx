"use client";

import { MapPin } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";

export default function WhereWeWorkSection() {
  return (
    <section
      id="where-we-work"
      className="section-padding bg-cream"
      aria-label="Where We Work"
    >
      <div className="container-narrow mx-auto">
        <SectionHeading
          title="Where We Work"
          subtitle="Based in the historic city of Ayodhya, serving communities across the region."
        />

        <ScrollReveal>
          <div className="relative max-w-3xl mx-auto">
            {/* Stylized UP Map (SVG) */}
            <div className="relative bg-white rounded-3xl p-8 md:p-12 border border-forest/5 shadow-sm">
              <svg
                viewBox="0 0 600 400"
                className="w-full h-auto"
                aria-label="Map of Uttar Pradesh highlighting Ayodhya"
                role="img"
              >
                {/* Simplified UP outline */}
                <path
                  d="M80,180 Q90,120 140,90 Q180,60 220,70 Q250,50 280,60 Q310,40 340,55 Q370,45 400,60 Q430,50 460,70 Q490,55 510,80 Q540,90 550,120 Q560,150 540,180 Q530,200 520,220 Q500,250 480,260 Q460,280 430,290 Q400,310 370,300 Q340,310 310,300 Q280,320 250,310 Q220,330 190,310 Q160,320 140,300 Q110,290 100,260 Q80,240 75,220 Q70,200 80,180 Z"
                  fill="#E8F0EB"
                  stroke="#174A3A"
                  strokeWidth="1.5"
                  opacity="0.8"
                />

                {/* Region highlights */}
                <circle cx="340" cy="170" r="40" fill="#3E8E5B" opacity="0.15" />
                <circle cx="340" cy="170" r="25" fill="#3E8E5B" opacity="0.2" />

                {/* Ayodhya marker */}
                <g className="cursor-pointer">
                  {/* Pulse ring */}
                  <circle cx="340" cy="170" r="12" fill="none" stroke="#E69A32" strokeWidth="2" opacity="0.5">
                    <animate attributeName="r" values="12;20;12" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
                  </circle>
                  {/* Dot */}
                  <circle cx="340" cy="170" r="6" fill="#E69A32" />
                  <circle cx="340" cy="170" r="3" fill="white" />
                </g>

                {/* Label */}
                <text
                  x="340"
                  y="145"
                  textAnchor="middle"
                  fill="#174A3A"
                  fontSize="14"
                  fontWeight="600"
                  fontFamily="var(--font-heading)"
                >
                  Ayodhya
                </text>

                {/* State label */}
                <text
                  x="300"
                  y="370"
                  textAnchor="middle"
                  fill="#174A3A"
                  fontSize="12"
                  fontWeight="500"
                  opacity="0.5"
                  letterSpacing="4"
                >
                  UTTAR PRADESH
                </text>
              </svg>
            </div>

            {/* Location Card */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-6 py-4 border border-forest/5 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-forest/5 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-saffron" />
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold text-forest"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Ayodhya, Uttar Pradesh
                  </h3>
                  <p className="text-sm text-charcoal-light">
                    Foundation headquarters and primary operating region
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
