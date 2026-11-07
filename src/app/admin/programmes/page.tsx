"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Check,
  X,
  GraduationCap,
  Heart,
  Users,
  Wrench,
  Stethoscope,
  HandHeart,
} from "lucide-react";
import { type StoredProgramme } from "@/lib/storage";
import {
  fetchAdminProgrammes,
  saveAdminProgramme,
  deleteAdminProgramme,
  togglePublishProgrammeInDb,
} from "@/lib/supabase/db";
import { motion, AnimatePresence } from "framer-motion";

const availableIcons = [
  "GraduationCap",
  "Heart",
  "Users",
  "Wrench",
  "Stethoscope",
  "HandHeart",
];

const defaultImages = [
  "/images/education.jpg",
  "/images/community-relief.jpg",
  "/images/healthcare-camp.jpg",
  "/images/women-empowerment.jpg",
  "/images/skill-development.jpg",
  "/images/inclusive-support.jpg",
];

export default function AdminProgrammesPage() {
  const [programmes, setProgrammes] = useState<StoredProgramme[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: defaultImages[0],
    icon: "GraduationCap",
    published: true,
  });

  const loadData = () => {
    fetchAdminProgrammes().then(setProgrammes);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      image: defaultImages[0],
      icon: "GraduationCap",
      published: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p: StoredProgramme) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      description: p.description,
      image: p.image,
      icon: p.icon,
      published: p.published,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    await saveAdminProgramme({
      id: editingId || undefined,
      title: formData.title.trim(),
      description: formData.description.trim(),
      image: formData.image,
      icon: formData.icon,
      published: formData.published,
    });

    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this programme?")) {
      await deleteAdminProgramme(id);
      loadData();
    }
  };

  const handleTogglePublish = async (id: string) => {
    await togglePublishProgrammeInDb(id);
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
            Foundation Programmes
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Manage public initiatives, descriptions, visual assets, and publication status
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest hover:bg-forest-light text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Programme
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programmes.map((p) => (
          <div
            key={p.id}
            className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 shadow-sm flex flex-col ${
              p.published ? "border-forest/10" : "border-amber-300 bg-amber-50/20 opacity-80"
            }`}
          >
            {/* Image */}
            <div className="relative h-44 bg-forest/5 overflow-hidden">
              <Image
                src={p.image}
                alt={p.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-full shadow-sm backdrop-blur-md ${
                    p.published
                      ? "bg-green/90 text-white"
                      : "bg-amber-600/90 text-white"
                  }`}
                >
                  {p.published ? "Published" : "Draft / Hidden"}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3
                  className="text-lg font-bold text-forest mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {p.title}
                </h3>
                <p className="text-xs text-charcoal-light line-clamp-3 leading-relaxed mb-4">
                  {p.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-forest/5">
                <button
                  onClick={() => handleTogglePublish(p.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    p.published
                      ? "text-amber-700 hover:bg-amber-100/60"
                      : "text-green hover:bg-green/10"
                  }`}
                >
                  {p.published ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" /> Publish
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 text-charcoal-light hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
                    title="Edit Programme"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 text-charcoal-light hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Programme"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
              className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-forest/10">
                <h3
                  className="text-xl font-bold text-forest"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {editingId ? "Edit Programme" : "Add New Programme"}
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
                    placeholder="e.g. Healthcare for All"
                    className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Explain the goals and community impact of this programme..."
                    className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                  />
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
                    {defaultImages.map((img) => (
                      <option key={img} value={img}>
                        {img}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                    Icon Theme
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                  >
                    {availableIcons.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 text-green rounded focus:ring-green"
                  />
                  <label htmlFor="published" className="text-xs font-medium text-charcoal">
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
                    {editingId ? "Save Changes" : "Create Programme"}
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
