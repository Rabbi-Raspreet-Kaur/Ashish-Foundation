"use client";

import { useState } from "react";
import { Heart, Users, Handshake, ArrowRight, CheckCircle } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Modal from "@/components/ui/Modal";
import Link from "next/link";
import { addVolunteer } from "@/lib/storage";
import { submitVolunteerRegistration } from "@/app/actions/submit";

const helpOptions = [
  {
    title: "Donate",
    description: "Your contribution can create opportunity for those who need it most.",
    icon: Heart,
    cta: "Donate Now",
    href: "/#donate",
    accent: "saffron",
    bgClass: "bg-saffron/5 hover:bg-saffron/10",
    iconBg: "bg-saffron/10",
    iconColor: "text-saffron",
    btnClass: "bg-saffron hover:bg-saffron-dark",
    action: "link" as const,
  },
  {
    title: "Volunteer",
    description: "Give your time, skills and energy to help make a difference in communities.",
    icon: Users,
    cta: "Become a Volunteer",
    href: "#",
    accent: "green",
    bgClass: "bg-green/5 hover:bg-green/10",
    iconBg: "bg-green/10",
    iconColor: "text-green",
    btnClass: "bg-green hover:bg-green-dark",
    action: "volunteer" as const,
  },
  {
    title: "Partner",
    description: "Collaborate with us to create lasting and meaningful impact together.",
    icon: Handshake,
    cta: "Partner With Us",
    href: "/contact",
    accent: "forest",
    bgClass: "bg-forest/5 hover:bg-forest/10",
    iconBg: "bg-forest/10",
    iconColor: "text-forest",
    btnClass: "bg-forest hover:bg-forest-light",
    action: "link" as const,
  },
];

const interestOptions = [
  "Education",
  "Healthcare",
  "Women Empowerment",
  "Skill Development",
  "Community Relief",
  "Event Support",
  "Administration",
  "Other",
];

export default function HowToHelpSection() {
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "Education",
    message: "",
  });

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await submitVolunteerRegistration(formData);
      if (res.success) {
        addVolunteer(formData);
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setShowVolunteerModal(false);
          setFormData({ name: "", email: "", phone: "", interest: "Education", message: "" });
        }, 3000);
      } else {
        setErrorMessage(res.message || "Failed to submit registration.");
      }
    } catch {
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section
        id="help"
        className="section-padding bg-offwhite"
        aria-label="How You Can Help"
      >
        <div className="container-narrow mx-auto">
          <SectionHeading
            title="How You Can Help"
            subtitle="Every act of support — big or small — creates ripples of positive change."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {helpOptions.map((option, i) => (
              <ScrollReveal key={option.title} delay={i * 0.1}>
                <div
                  className={`group relative rounded-2xl p-8 border border-forest/5 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 ${option.bgClass} h-full flex flex-col`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${option.iconBg} flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110`}
                  >
                    <option.icon className={`w-6 h-6 ${option.iconColor}`} />
                  </div>

                  <h3
                    className="text-2xl font-bold text-forest mb-3"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {option.title}
                  </h3>

                  <p className="text-sm text-charcoal-light leading-relaxed mb-8 flex-1">
                    {option.description}
                  </p>

                  {option.action === "volunteer" ? (
                    <button
                      onClick={() => setShowVolunteerModal(true)}
                      className={`inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 ${option.btnClass} text-white font-semibold text-sm rounded-full transition-all duration-300 hover:shadow-lg group/btn`}
                    >
                      {option.cta}
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  ) : (
                    <Link
                      href={option.href}
                      className={`inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 ${option.btnClass} text-white font-semibold text-sm rounded-full transition-all duration-300 hover:shadow-lg group/btn`}
                    >
                      {option.cta}
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Signup Modal */}
      <Modal
        open={showVolunteerModal}
        onClose={() => {
          if (!submitted) setShowVolunteerModal(false);
        }}
        title={submitted ? undefined : "Become a Volunteer"}
      >
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green" />
            </div>
            <h3
              className="text-xl font-bold text-forest mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Thank You!
            </h3>
            <p className="text-sm text-charcoal-light">
              Your volunteer registration has been received. We&apos;ll be in touch
              soon!
            </p>
          </div>
        ) : (
          <form onSubmit={handleVolunteerSubmit} className="space-y-4">
            <p className="text-sm text-charcoal-light mb-2">
              Fill out this form and we&apos;ll connect you with opportunities to
              make a difference.
            </p>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Full Name <span className="text-terracotta">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Email <span className="text-terracotta">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Area of Interest
              </label>
              <select
                value={formData.interest}
                onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all"
              >
                {interestOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Message (optional)
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-terracotta/10 border border-terracotta/20 text-terracotta text-xs">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-green hover:bg-green-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg"
            >
              <Users className="w-4 h-4" />
              {isSubmitting ? "Registering..." : "Register as Volunteer"}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
