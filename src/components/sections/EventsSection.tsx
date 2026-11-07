"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, CheckCircle, UserPlus } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Modal from "@/components/ui/Modal";
import { EVENTS } from "@/lib/constants";
import { addEventRegistration } from "@/lib/storage";
import { fetchPublicEvents } from "@/lib/supabase/db";
import { submitEventRegistration } from "@/app/actions/submit";

interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
}

export default function EventsSection() {
  const [allEvents, setAllEvents] = useState<EventItem[]>([...EVENTS]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "" });

  // Load events on mount from Supabase / local
  useEffect(() => {
    let mounted = true;
    fetchPublicEvents().then((events) => {
      if (mounted && events && events.length > 0) {
        setAllEvents(events);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleRegister = (event: EventItem) => {
    setSelectedEvent(event);
    setErrorMessage("");
    setShowRegModal(true);
  };

  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await submitEventRegistration({
        eventId: selectedEvent.id,
        eventTitle: selectedEvent.title,
        name: regForm.name,
        email: regForm.email,
        phone: regForm.phone,
      });

      if (res.success) {
        addEventRegistration({
          eventId: selectedEvent.id,
          eventTitle: selectedEvent.title,
          name: regForm.name,
          email: regForm.email,
          phone: regForm.phone,
        });

        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setShowRegModal(false);
          setRegForm({ name: "", email: "", phone: "" });
          setSelectedEvent(null);
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

  const topEvents = allEvents.slice(0, 3);
  const moreEvents = allEvents.slice(3);

  return (
    <>
      <section
        id="events"
        className="section-padding bg-offwhite"
        aria-label="Events and Activities"
      >
        <div className="container-wide mx-auto">
          <SectionHeading
            title="Events & Activities"
            subtitle="Upcoming and ongoing programmes bringing positive change to communities."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {topEvents.map((event, i) => (
              <ScrollReveal key={event.id} delay={i * 0.1}>
                <article className="group bg-white rounded-2xl overflow-hidden border border-forest/5 hover:border-green/20 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent" />
                    {/* Date badge */}
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-saffron text-white rounded-full text-xs font-semibold">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3
                      className="text-lg font-semibold text-forest mb-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {event.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-charcoal-light mb-3">
                      <MapPin className="w-3 h-3 text-green" />
                      <span>{event.location}</span>
                    </div>

                    <p className="text-sm text-charcoal-light leading-relaxed flex-1 mb-4">
                      {event.description}
                    </p>

                    <button
                      onClick={() => handleRegister(event)}
                      className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-forest/5 hover:bg-forest text-forest hover:text-white font-medium text-sm rounded-xl transition-all duration-300"
                    >
                      <UserPlus className="w-4 h-4" />
                      Register
                    </button>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          {/* More events row */}
          {moreEvents.length > 0 && (
            <ScrollReveal delay={0.3}>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {moreEvents.map((event) => (
                  <div
                    key={event.id}
                    className="group flex items-center gap-4 bg-white rounded-xl p-4 border border-forest/5 hover:border-green/20 transition-all duration-300 hover:shadow-md cursor-pointer"
                    onClick={() => handleRegister(event)}
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-forest mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-charcoal-light">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-charcoal-light group-hover:text-green transition-colors flex-shrink-0" />
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Event Registration Modal */}
      <Modal
        open={showRegModal}
        onClose={() => {
          if (!submitted) setShowRegModal(false);
        }}
        title={submitted ? undefined : `Register for ${selectedEvent?.title || "Event"}`}
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
              Registered!
            </h3>
            <p className="text-sm text-charcoal-light">
              You&apos;re registered for {selectedEvent?.title}. We&apos;ll send
              details to your email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegSubmit} className="space-y-4">
            {selectedEvent && (
              <div className="bg-cream rounded-xl p-4 mb-2">
                <p className="text-sm font-medium text-forest">
                  {selectedEvent.title}
                </p>
                <div className="flex items-center gap-3 text-xs text-charcoal-light mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {selectedEvent.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedEvent.location}
                  </span>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Full Name <span className="text-terracotta">*</span>
              </label>
              <input
                type="text"
                required
                value={regForm.name}
                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
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
                value={regForm.email}
                onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
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
                value={regForm.phone}
                onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all"
                placeholder="+91 XXXXX XXXXX"
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
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-forest hover:bg-forest-light disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg"
            >
              <UserPlus className="w-4 h-4" />
              {isSubmitting ? "Registering..." : "Register Now"}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
