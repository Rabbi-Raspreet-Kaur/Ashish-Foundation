import type { Metadata } from "next";
import { Shield } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import TransparencyDocList from "./TransparencyDocList";

export const metadata: Metadata = {
  title: "Transparency & Governance",
  description:
    "Ashish Foundation is committed to transparency and accountability. Access our reports, certificates and official documents.",
};

export default function TransparencyPage() {
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
            Accountability
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Transparency
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            We believe in complete transparency and accountability to our donors,
            volunteers and communities.
          </p>
        </div>
      </section>

      {/* Trust Statement */}
      <section className="section-padding bg-cream">
        <div className="container-narrow mx-auto">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-green/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green" />
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold text-forest mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Our Commitment to Trust
              </h2>
              <p className="text-base text-charcoal-light leading-relaxed">
                Ashish Foundation is committed to maintaining the highest
                standards of transparency. We make our organizational documents,
                reports and records available to demonstrate our accountability
                to everyone who supports our mission.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="section-padding bg-offwhite">
        <div className="container-narrow mx-auto">
          <SectionHeading
            title="Reports & Documents"
            subtitle="Access our official documents and reports."
          />

          <TransparencyDocList />

          <ScrollReveal delay={0.4}>
            <div className="mt-12 bg-cream rounded-2xl p-6 md:p-8 text-center border border-forest/5">
              <p className="text-sm text-charcoal-light leading-relaxed">
                <strong className="text-forest">Note:</strong> Documents and
                reports are published as they are audited and finalized. For any
                specific information or compliance requests, please{" "}
                <a href="/contact" className="text-green hover:text-forest underline">
                  contact our team
                </a>
                .
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
