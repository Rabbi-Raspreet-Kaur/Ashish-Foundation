"use client";

import { useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
  Globe,
  Camera,
  MessageCircle,
  Video,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { SITE } from "@/lib/constants";
import { addContact } from "@/lib/storage";
import { submitContactForm } from "@/app/actions/submit";

const socialIcons = [
  { icon: Globe, href: SITE.social.facebook, label: "Facebook" },
  { icon: Camera, href: SITE.social.instagram, label: "Instagram" },
  { icon: MessageCircle, href: SITE.social.twitter, label: "Twitter" },
  { icon: Video, href: SITE.social.youtube, label: "YouTube" },
  { icon: Briefcase, href: SITE.social.linkedin, label: "LinkedIn" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await submitContactForm(formData);
      if (res.success) {
        // Mirror locally for instant offline preview
        addContact({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        });
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setErrorMessage(res.message || "Could not send message. Please check your input.");
      }
    } catch {
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            Get in Touch
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Contact Us
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            We would love to hear from you. Reach out for questions,
            volunteering, partnerships or support.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-offwhite">
        <div className="container-narrow mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <ScrollReveal>
              <div className="bg-white rounded-3xl p-8 md:p-10 border border-forest/5 shadow-sm">
                <h2
                  className="text-2xl font-bold text-forest mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Send a Message
                </h2>
                <p className="text-sm text-charcoal-light mb-8">
                  Fill out the form below and we will get back to you.
                </p>

                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green" />
                    </div>
                    <h3
                      className="text-xl font-semibold text-forest mb-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Message Sent!
                    </h3>
                    <p className="text-sm text-charcoal-light">
                      Thank you for reaching out. We will respond soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-charcoal mb-1.5"
                      >
                        Full Name <span className="text-terracotta">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all duration-300"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-charcoal mb-1.5"
                      >
                        Email Address <span className="text-terracotta">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all duration-300"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-charcoal mb-1.5"
                      >
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all duration-300"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="donate">Donation</option>
                        <option value="partner">Partnership</option>
                        <option value="media">Media</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-charcoal mb-1.5"
                      >
                        Message <span className="text-terracotta">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all duration-300 resize-none"
                        placeholder="Your message..."
                      />
                    </div>

                    {errorMessage && (
                      <div className="p-3.5 rounded-xl bg-terracotta/10 border border-terracotta/20 text-terracotta text-sm">
                        {errorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-forest hover:bg-forest-light disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-forest/25"
                    >
                      <Send className="w-4 h-4" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* Contact Info */}
            <ScrollReveal delay={0.2}>
              <div className="space-y-8">
                <div>
                  <h2
                    className="text-2xl font-bold text-forest mb-6"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Get in Touch
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-forest/5">
                      <div className="w-10 h-10 rounded-xl bg-forest/5 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-saffron" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-forest mb-1">
                          Address
                        </h3>
                        <p className="text-sm text-charcoal-light">
                          {SITE.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-forest/5">
                      <div className="w-10 h-10 rounded-xl bg-forest/5 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-saffron" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-forest mb-1">
                          Email
                        </h3>
                        <p className="text-sm text-charcoal-light">
                          {SITE.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-forest/5">
                      <div className="w-10 h-10 rounded-xl bg-forest/5 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-saffron" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-forest mb-1">
                          Phone
                        </h3>
                        <p className="text-sm text-charcoal-light">
                          {SITE.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-forest/5">
                      <div className="w-10 h-10 rounded-xl bg-forest/5 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-saffron" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-forest mb-1">
                          Office Hours
                        </h3>
                        <p className="text-sm text-charcoal-light">
                          Monday – Saturday: 10:00 AM – 6:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal mb-4">
                    Follow Us
                  </h3>
                  <div className="flex gap-3">
                    {socialIcons.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full bg-forest/5 flex items-center justify-center text-forest hover:bg-saffron hover:text-white transition-all duration-300"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Map Embed */}
                <div className="rounded-2xl overflow-hidden border border-forest/5">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113829.58498960553!2d82.11499544140625!3d26.79451215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399a07cd3a0e544d%3A0x4b8a78f248e430b7!2sAyodhya%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1692000000000!5m2!1sen!2sin"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ashish Foundation Location — Ayodhya, Uttar Pradesh"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
