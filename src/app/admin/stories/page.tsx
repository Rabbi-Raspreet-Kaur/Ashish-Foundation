"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  X,
  MapPin,
} from "lucide-react";
import { type StoredStory } from "@/lib/storage";
import {
  fetchAdminStories,
  saveAdminStory,
  deleteAdminStory,
  togglePublishStoryInDb,
} from "@/lib/supabase/db";
import { motion, AnimatePresence } from "framer-motion";

const defaultStoryImages = [
  "/images/community-relief.jpg",
  "/images/healthcare-camp.jpg",
  "/images/education.jpg",
  "/images/women-empowerment.jpg",
  "/images/skill-development.jpg",
  "/images/inclusive-support.jpg",
];

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<StoredStory[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "Ayodhya, Uttar Pradesh",
    programme: "Community Relief",
    image: defaultStoryImages[0],
    tagline: "",
    before: "",
    after: "",
    published: true,
  });

  const loadData = () => {
    fetchAdminStories().then(setStories);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      location: "Ayodhya, Uttar Pradesh",
      programme: "Community Relief",
      image: defaultStoryImages[0],
      tagline: "",
      before: "",
      after: "",
      published: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s: StoredStory) => {
    setEditingId(s.id);
    setFormData({
      title: s.title,
      location: s.location,
      programme: s.programme,
      image: s.image,
      tagline: s.tagline,
      before: s.before,
      after: s.after,
      published: s.published,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.before || !formData.after) return;

    await saveAdminStory({
      id: editingId || undefined,
      title: formData.title.trim(),
      location: formData.location.trim(),
      programme: formData.programme.trim(),
      image: formData.image,
      tagline: formData.tagline.trim(),
      before: formData.before.trim(),
      after: formData.after.trim(),
      published: formData.published,
    });

    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this story?")) {
      await deleteAdminStory(id);
      loadData();
    }
  };

  const handleTogglePublish = async (id: string) => {
    await togglePublishStoryInDb(id);
    loadData();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-forest"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Stories of Change
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Real beneficiary stories, before-and-after transformations, and publication status
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest hover:bg-forest-light text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Story
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stories.map((s) => (
          <div
            key={s.id}
            className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 shadow-sm flex flex-col justify-between ${
              s.published ? "border-forest/10" : "border-amber-300 bg-amber-50/20 opacity-80"
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-forest/5 text-forest mb-1.5">
                    {s.programme}
                  </span>
                  <h3
                    className="text-lg font-bold text-forest"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-xs text-charcoal-light flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-saffron" />
                    {s.location}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-full shrink-0 ${
                    s.published
                      ? "bg-green/15 text-green"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {s.published ? "Published" : "Draft / Hidden"}
                </span>
              </div>

              {s.tagline && (
                <p className="text-xs italic text-charcoal/80 mb-3 border-l-2 border-saffron pl-2.5 py-0.5">
                  &ldquo;{s.tagline}&rdquo;
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs">
                <div className="bg-offwhite p-3 rounded-xl border border-forest/5">
                  <span className="font-semibold text-charcoal block mb-1">Before:</span>
                  <p className="text-charcoal-light leading-relaxed">{s.before}</p>
                </div>
                <div className="bg-green/5 p-3 rounded-xl border border-green/10">
                  <span className="font-semibold text-forest block mb-1">After:</span>
                  <p className="text-charcoal-light leading-relaxed">{s.after}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-forest/5 border-t border-forest/5 flex items-center justify-between">
              <button
                onClick={() => handleTogglePublish(s.id)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                  s.published ? "text-amber-700 hover:underline" : "text-green hover:underline"
                }`}
              >
                {s.published ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" /> Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" /> Publish to Website
                  </>
                )}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="p-1.5 text-charcoal-light hover:text-forest hover:bg-white rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 text-charcoal-light hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-forest/10">
                <h3
                  className="text-xl font-bold text-forest"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {editingId ? "Edit Story" : "Add Beneficiary Story"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-charcoal-light hover:text-charcoal rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Community Relief & Education Support"
                    className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                      Programme
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.programme}
                      onChange={(e) => setFormData({ ...formData, programme: e.target.value })}
                      placeholder="e.g. Education"
                      className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Ayodhya, UP"
                      className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                    Quote / Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="Short uplifting headline or quote..."
                    className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                      Before Situation
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.before}
                      onChange={(e) => setFormData({ ...formData, before: e.target.value })}
                      placeholder="Describe the challenges faced..."
                      className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                      After Impact
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.after}
                      onChange={(e) => setFormData({ ...formData, after: e.target.value })}
                      placeholder="Describe the positive change..."
                      className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                    Image
                  </label>
                  <select
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                  >
                    {defaultStoryImages.map((img) => (
                      <option key={img} value={img}>
                        {img}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="story-published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 text-green rounded focus:ring-green"
                  />
                  <label htmlFor="story-published" className="text-xs font-medium text-charcoal">
                    Publish immediately to the public website
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-forest/10 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 text-xs font-semibold text-charcoal-light hover:text-charcoal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded-full shadow-md"
                  >
                    {editingId ? "Save Changes" : "Create Story"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
