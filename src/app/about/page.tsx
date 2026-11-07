import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Target,
  Eye,
  Heart,
  Shield,
  Users,
  Sparkles,
  Scale,
  User,
  Phone,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { LEADERSHIP, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Ashish Foundation — our story, mission, vision, values, and the team working towards education, empowerment and inclusion in Ayodhya.",
};

const timelineSteps = [
  { title: "Foundation", description: "Establishment of Ashish Foundation", icon: Heart },
  { title: "Community Initiatives", description: "Launch of community outreach programmes", icon: Users },
  { title: "Education", description: "Educational support programmes initiated", icon: BookOpen },
  { title: "Skill Development", description: "Vocational training programmes introduced", icon: Sparkles },
  { title: "Empowerment", description: "Women empowerment and inclusive programmes", icon: Shield },
  { title: "Expansion", description: "Growing impact across the region", icon: Target },
];

export default function AboutPage() {
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
            About Us
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Story
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            A foundation rooted in compassion, driven by purpose, and committed
            to creating lasting change.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-cream">
        <div className="container-narrow mx-auto">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2
                className="text-3xl md:text-4xl font-bold text-forest mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Who We Are
              </h2>
              <p className="text-lg text-charcoal-light leading-relaxed mb-6">
                Ashish Foundation is a social organization based in Ayodhya,
                Uttar Pradesh, India. We are committed to creating opportunities
                for individuals and communities who need them most.
              </p>
              <p className="text-base text-charcoal-light leading-relaxed mb-6">
                Our work spans education, inclusive support, women empowerment,
                skill development, healthcare and community relief. We believe
                that meaningful change happens when people are given the
                opportunity and support to build a better future for themselves.
              </p>
              <div className="h-1 w-16 rounded-full bg-saffron mx-auto" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="section-padding bg-offwhite">
        <div className="container-narrow mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Mission */}
            <ScrollReveal delay={0}>
              <div className="bg-white rounded-2xl p-8 border border-forest/5 h-full">
                <div className="w-12 h-12 rounded-xl bg-forest/5 flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-forest" />
                </div>
                <h3
                  className="text-xl font-semibold text-forest mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Our Mission
                </h3>
                <p className="text-sm text-charcoal-light leading-relaxed">
                  To create opportunities for education, empowerment and
                  inclusion, enabling individuals and communities to build better
                  lives with dignity and self-reliance.
                </p>
              </div>
            </ScrollReveal>

            {/* Vision */}
            <ScrollReveal delay={0.1}>
              <div className="bg-white rounded-2xl p-8 border border-forest/5 h-full">
                <div className="w-12 h-12 rounded-xl bg-green/5 flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6 text-green" />
                </div>
                <h3
                  className="text-xl font-semibold text-forest mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Our Vision
                </h3>
                <p className="text-sm text-charcoal-light leading-relaxed">
                  A society where every individual has access to education,
                  healthcare, and the opportunity to live a life of dignity,
                  irrespective of their background or circumstances.
                </p>
              </div>
            </ScrollReveal>

            {/* Values */}
            <ScrollReveal delay={0.2}>
              <div className="bg-white rounded-2xl p-8 border border-forest/5 h-full">
                <div className="w-12 h-12 rounded-xl bg-saffron/5 flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 text-saffron" />
                </div>
                <h3
                  className="text-xl font-semibold text-forest mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Our Values
                </h3>
                <ul className="space-y-2 text-sm text-charcoal-light">
                  <li className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-green" />
                    Education & Knowledge
                  </li>
                  <li className="flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5 text-green" />
                    Equality & Justice
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-green" />
                    Empowerment & Growth
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-green" />
                    Dignity & Respect
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="section-padding bg-cream">
        <div className="container-narrow mx-auto">
          <SectionHeading
            title="Our Journey"
            subtitle="Key milestones in our ongoing journey towards creating lasting change."
          />

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-forest/10 -translate-x-1/2" />

            {timelineSteps.map((step, i) => {
              const Icon = step.icon;
              const isLeft = i % 2 === 0;
              return (
                <ScrollReveal key={step.title} delay={i * 0.1}>
                  <div
                    className={`relative flex items-start mb-12 last:mb-0 ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content */}
                    <div
                      className={`flex-1 ml-16 md:ml-0 ${
                        isLeft
                          ? "md:pr-12 md:text-right"
                          : "md:pl-12 md:text-left"
                      }`}
                    >
                      <h3
                        className="text-lg font-semibold text-forest mb-1"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-sm text-charcoal-light">
                        {step.description}
                      </p>
                    </div>

                    {/* Circle marker */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-2 border-forest/10 flex items-center justify-center z-10">
                      <Icon className="w-5 h-5 text-forest" />
                    </div>

                    {/* Empty side for alignment */}
                    <div className="hidden md:block flex-1" />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={0.5}>
            <p className="text-center text-xs text-charcoal-light/60 italic mt-8">
              Timeline milestones are placeholder content. Update with verified
              foundation history.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Leadership */}
      <section className="section-padding bg-offwhite">
        <div className="container-narrow mx-auto">
          <SectionHeading
            title="Our Leadership"
            subtitle="The dedicated individuals guiding our mission forward."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {LEADERSHIP.map((member, i) => (
              <ScrollReveal key={member.role} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 border border-forest/5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-500 h-full">
                  {/* Avatar placeholder */}
                  <div className="w-24 h-24 rounded-full bg-forest/5 flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-forest/30" />
                  </div>
                  <h3
                    className="text-lg font-semibold text-forest mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {member.name}
                  </h3>
                  <span className="inline-block text-xs font-medium text-saffron uppercase tracking-wider mb-3">
                    {member.role}
                  </span>
                  <p className="text-sm text-charcoal-light leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Connect & Contact Callout */}
      <section className="section-padding bg-cream">
        <div className="container-narrow mx-auto text-center">
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-forest/5 shadow-sm max-w-2xl mx-auto">
              <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-green border border-green/20 rounded-full bg-green/5 mb-4">
                Get In Touch
              </span>
              <h2
                className="text-2xl md:text-3xl font-bold text-forest mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Connect with Ashish Foundation
              </h2>
              <p className="text-charcoal-light mb-8 max-w-md mx-auto text-sm leading-relaxed">
                Have questions or want to partner with us? Reach out directly to learn more about our programmes and community initiatives.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-forest text-white rounded-full font-medium text-sm hover:bg-forest/90 transition-all duration-300 shadow-md shadow-forest/10"
                >
                  <Phone className="w-4 h-4 text-saffron" />
                  <span>Call {SITE.phone}</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-forest/15 text-forest rounded-full font-medium text-sm hover:bg-forest/5 transition-colors duration-300"
                >
                  Contact Form
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
