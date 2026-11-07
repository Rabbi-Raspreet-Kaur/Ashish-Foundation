"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { GALLERY_IMAGES, GALLERY_CATEGORIES } from "@/lib/constants";
import { fetchPublicGallery } from "@/lib/supabase/db";
import { motion, AnimatePresence } from "framer-motion";

export default function GalleryPage() {
  const [images, setImages] = useState<Array<{ src: string; alt: string; category: string }>>([
    ...GALLERY_IMAGES,
  ]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  useEffect(() => {
    let mounted = true;
    fetchPublicGallery().then((data) => {
      if (mounted && data && data.length > 0) {
        setImages(data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter((img) => img.category === activeCategory);

  useEffect(() => {
    if (lightboxImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxImage]);

  const openLightbox = (src: string, alt: string) => {
    setLightboxImage(src);
    setLightboxAlt(alt);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-forest overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-green blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-saffron blur-3xl" />
        </div>
        <div className="container-narrow mx-auto px-4 md:px-8 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-saffron border border-saffron/30 rounded-full bg-saffron/10 mb-6">
            Gallery
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Moments That Matter
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            A visual journey through our work, our communities, and the lives we
            touch.
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="section-padding bg-offwhite">
        <div className="container-wide mx-auto">
          {/* Category Filters */}
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {GALLERY_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-forest text-white shadow-lg shadow-forest/20"
                      : "bg-white text-charcoal-light border border-forest/10 hover:border-green/30 hover:text-forest"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, i) => (
                <motion.div
                  key={`${image.src}-${activeCategory}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="break-inside-avoid mb-4 md:mb-6"
                >
                  <button
                    onClick={() => openLightbox(image.src, image.alt)}
                    className="group relative w-full rounded-2xl overflow-hidden block focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                  >
                    <div
                      className={`relative w-full ${
                        i % 3 === 0
                          ? "aspect-[3/4]"
                          : i % 3 === 1
                          ? "aspect-square"
                          : "aspect-[4/3]"
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    {/* Caption overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-forest">
                        {image.category}
                      </span>
                      <p className="text-sm text-white mt-2 font-medium">
                        {image.alt}
                      </p>
                    </div>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <p className="text-center text-xs text-charcoal-light/60 italic mt-8">
            Replace with authentic foundation photography for the best experience.
          </p>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[80vh] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImage}
                alt={lightboxAlt}
                width={1200}
                height={800}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <p className="text-white text-sm">{lightboxAlt}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
