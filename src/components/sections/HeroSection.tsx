"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Welcome to Ashish Foundation"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/foundation-team.jpeg"
          alt="Ashish Foundation members gathered at an event with foundation banner"
          fill
          className="object-cover"
          style={{ objectPosition: "center 20%" }}
          priority
          quality={90}
        />
        {/* Dark green overlay — strong enough for white text on any image */}
        <div className="absolute inset-0 bg-forest/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-narrow mx-auto px-4 md:px-8 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-1.5 text-xs md:text-sm font-medium tracking-widest uppercase text-saffron border border-saffron/30 rounded-full bg-saffron/10">
            Education • Empowerment • Inclusion • Dignity
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
          style={{
            fontFamily: "var(--font-heading)",
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}
        >
          <span className="text-white">Creating Opportunities.</span>
          <br />
          <span className="text-saffron">Changing Lives.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Ashish Foundation works towards a more educated, empowered and
          inclusive society where every individual can live with dignity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/#donate"
            className="inline-flex items-center gap-2 px-8 py-4 bg-saffron hover:bg-saffron-dark text-white font-semibold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-saffron/25 hover:scale-105 text-sm md:text-base"
          >
            Support Our Mission
          </Link>
          <Link
            href="/#our-work"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 hover:border-white/60 text-white font-medium rounded-full transition-all duration-300 hover:bg-white/10 text-sm md:text-base"
          >
            Explore Our Work
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/50 uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
