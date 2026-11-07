"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";

const COLLAGE_PHOTOS = [
  { src: "/images/community-relief.jpg", alt: "Ashish Foundation food distribution", caption: "Community Relief Drive", sub: "Food rations and essentials distributed to families", span: "col-span-2 row-span-2" },
  { src: "/images/healthcare-camp.jpg", alt: "Free Dental Checkup Camp", caption: "Free Dental Checkup Camp", sub: "23 April 2026 - Composite Junior High School, Usru", span: "col-span-1 row-span-1" },
  { src: "/images/inclusive-support.jpg", alt: "Team at Nagrik Prathmik Swasthya Kendra", caption: "Health Centre Initiative", sub: "Nagrik Prathmik Swasthya Kendra, Retiya, Ayodhya", span: "col-span-1 row-span-1" },
  { src: "/images/skill-development.jpg", alt: "Ashish Foundation Free Medical Camp", caption: "Free Medical Camp", sub: "Health consultations and medicines for the community", span: "col-span-1 row-span-1" },
  { src: "/images/education.jpg", alt: "Children classroom learning support", caption: "Education Support", sub: "Classroom learning and educational material distribution", span: "col-span-1 row-span-1" },
];

export default function PhotoCollageSection() {
  return (
    <section id="photo-gallery" className="section-padding bg-forest" aria-label="Photo Gallery">
      <div className="container-wide mx-auto">
        <SectionHeading title="Our Work in Action" subtitle="A glimpse of Ashish Foundation on-the-ground impact across Ayodhya and surrounding communities." light />
        <ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[220px] gap-3 md:gap-4">
            {COLLAGE_PHOTOS.map((photo, i) => (
              <div key={i} className={`relative overflow-hidden rounded-2xl group cursor-pointer ${photo.span}`}>
                <Image src={photo.src} alt={photo.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-110" loading={i === 0 ? "eager" : "lazy"} />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white font-semibold text-sm md:text-base leading-tight mb-1">{photo.caption}</p>
                  <p className="text-white/70 text-xs leading-snug opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{photo.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <div className="mt-8 text-center">
            <p className="text-white/50 text-sm">Ashish Foundation · Serving communities in Ayodhya, Uttar Pradesh</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
