"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, Plus, X } from "lucide-react";
import { type GalleryImage } from "@/lib/storage";
import {
  fetchAdminGallery,
  createAdminGalleryImage,
  removeAdminGalleryImage,
} from "@/lib/supabase/db";
import { GALLERY_IMAGES, GALLERY_CATEGORIES } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminGalleryPage() {
  const [customImages, setCustomImages] = useState<GalleryImage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    src: "",
    alt: "",
    category: "Education",
  });

  const loadGallery = () => {
    fetchAdminGallery().then(setCustomImages);
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAdminGalleryImage(formData);
    loadGallery();
    setFormData({ src: "", alt: "", category: "Education" });
    setShowForm(false);
  };

  const handleRemove = async (src: string) => {
    await removeAdminGalleryImage(src);
    loadGallery();
  };

  const categories = GALLERY_CATEGORIES.filter((c) => c !== "All");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-forest"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Gallery
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Manage gallery images
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
              <Plus className="w-4 h-4" /> Add Image
            </>
          )}
        </button>
      </div>

      {/* Add Image Form */}
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
                className="text-lg font-semibold text-forest"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Add Gallery Image
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Image URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.src}
                    onChange={(e) =>
                      setFormData({ ...formData, src: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all text-sm"
                    placeholder="/images/photo.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Alt Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.alt}
                    onChange={(e) =>
                      setFormData({ ...formData, alt: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all text-sm"
                    placeholder="Description of image"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-green text-white text-sm font-semibold rounded-full hover:bg-green-dark transition-colors"
              >
                Add Image
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default Images */}
      <div className="mb-8">
        <h2
          className="text-lg font-semibold text-forest mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Default Images ({GALLERY_IMAGES.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="relative aspect-square rounded-xl overflow-hidden group"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-forest/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <div>
                  <span className="px-2 py-0.5 bg-white/90 text-forest text-xs font-medium rounded-full">
                    {img.category}
                  </span>
                  <p className="text-white text-xs mt-1 line-clamp-2">
                    {img.alt}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Custom Images */}
      {customImages.length > 0 && (
        <div>
          <h2
            className="text-lg font-semibold text-forest mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Custom Images ({customImages.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {customImages.map((img, i) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="relative aspect-square rounded-xl overflow-hidden group bg-forest/5"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-forest/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleRemove(img.src)}
                    className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                  <span className="px-2 py-0.5 bg-white/90 text-forest text-xs font-medium rounded-full">
                    {img.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
