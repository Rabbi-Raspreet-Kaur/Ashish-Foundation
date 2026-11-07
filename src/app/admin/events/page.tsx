"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Plus,
  Trash2,
  MapPin,
  X,
} from "lucide-react";
import { type StoredEvent } from "@/lib/storage";
import {
  fetchAdminEvents,
  createAdminEvent,
  deleteAdminEvent,
} from "@/lib/supabase/db";
import { motion, AnimatePresence } from "framer-motion";

const defaultImages = [
  "/images/hero-bg.jpg",
  "/images/community-relief.jpg",
  "/images/healthcare-camp.jpg",
  "/images/women-empowerment.jpg",
  "/images/skill-development.jpg",
];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<StoredEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    image: defaultImages[0],
  });

  const loadEvents = () => {
    fetchAdminEvents().then(setEvents);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAdminEvent(formData);
    loadEvents();
    setFormData({
      title: "",
      date: "",
      location: "",
      description: "",
      image: defaultImages[0],
    });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    await deleteAdminEvent(id);
    loadEvents();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-forest"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Events
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Manage foundation events
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-forest text-white text-sm font-semibold rounded-full hover:bg-forest-light transition-colors"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" /> Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Add Event
            </>
          )}
        </button>
      </div>

      {/* Add Event Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-6 border border-forest/5 space-y-4"
            >
              <h2
                className="text-lg font-semibold text-forest mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                New Event
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all text-sm"
                    placeholder="e.g. Education Drive"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all text-sm"
                    placeholder="e.g. 15 Sept 2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all text-sm"
                    placeholder="e.g. Ayodhya, UP"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Cover Image
                  </label>
                  <select
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all text-sm"
                  >
                    {defaultImages.map((img) => (
                      <option key={img} value={img}>
                        {img.split("/").pop()?.replace(".jpg", "")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all text-sm resize-none"
                  placeholder="Describe the event..."
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-green text-white text-sm font-semibold rounded-full hover:bg-green-dark transition-colors"
              >
                Create Event
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events List */}
      {events.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-12 border border-forest/5 text-center"
        >
          <Calendar className="w-12 h-12 text-charcoal-light/20 mx-auto mb-4" />
          <p className="text-charcoal-light">No custom events created yet.</p>
          <p className="text-xs text-charcoal-light/60 mt-1">
            Click &ldquo;Add Event&rdquo; to create your first event.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-5 border border-forest/5 flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <h3
                  className="text-base font-semibold text-forest mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {event.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-charcoal-light mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </span>
                </div>
                <p className="text-sm text-charcoal-light leading-relaxed">
                  {event.description}
                </p>
              </div>
              <button
                onClick={() => handleDelete(event.id)}
                className="p-2 rounded-lg text-charcoal-light hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                aria-label="Delete event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
