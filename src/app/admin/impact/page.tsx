"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Plus,
  Trash2,
  Edit,
  ShieldCheck,
  X,
  Users,
  Check,
} from "lucide-react";
import { type StoredImpactStat } from "@/lib/storage";
import {
  fetchAdminImpactStats,
  saveAdminImpactStat,
  deleteAdminImpactStat,
} from "@/lib/supabase/db";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminImpactPage() {
  const [stats, setStats] = useState<StoredImpactStat[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    value: 100,
    suffix: "+",
    verified: true,
  });

  const loadData = () => {
    fetchAdminImpactStats().then(setStats);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      label: "",
      value: 100,
      suffix: "+",
      verified: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (stat: StoredImpactStat) => {
    setEditingId(stat.id);
    setFormData({
      label: stat.label,
      value: stat.value,
      suffix: stat.suffix,
      verified: stat.verified,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || isNaN(formData.value)) return;

    await saveAdminImpactStat({
      id: editingId || undefined,
      label: formData.label.trim(),
      value: Number(formData.value),
      suffix: formData.suffix.trim() || "+",
      verified: formData.verified,
    });

    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this impact metric?")) {
      await deleteAdminImpactStat(id);
      loadData();
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-forest"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Impact Statistics
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Verified metrics showcased on the public homepage and about sections
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest hover:bg-forest-light text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Metric
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-forest/10 shadow-sm mb-6">
        <div className="flex items-center gap-3 p-4 bg-green/10 border border-green/20 rounded-2xl mb-6">
          <ShieldCheck className="w-5 h-5 text-green shrink-0" />
          <p className="text-xs text-forest">
            <strong>Data Accuracy Policy:</strong> Per foundation guidelines, all statistics displayed on public sections must represent genuine verified outreach records from Ashish Foundation activities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-offwhite rounded-2xl p-5 border border-forest/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-forest/5 text-forest">
                    {stat.verified ? "Verified Record" : "Pending Verification"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(stat)}
                      className="p-1 text-charcoal-light hover:text-forest transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(stat.id)}
                      className="p-1 text-charcoal-light hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div
                  className="text-3xl font-extrabold text-forest mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {stat.value.toLocaleString("en-IN")}{stat.suffix}
                </div>
                <p className="text-xs font-medium text-charcoal-light">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-forest/10">
                <h3
                  className="text-xl font-bold text-forest"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {editingId ? "Edit Impact Metric" : "Add Impact Metric"}
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
                    Metric Label
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g. Children Supported"
                    className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                      Numeric Value
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                      Suffix
                    </label>
                    <input
                      type="text"
                      value={formData.suffix}
                      onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                      placeholder="+"
                      className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="impact-verified"
                    checked={formData.verified}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    className="w-4 h-4 text-green rounded focus:ring-green"
                  />
                  <label htmlFor="impact-verified" className="text-xs font-medium text-charcoal">
                    Mark as officially verified record
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
                    {editingId ? "Save Changes" : "Save Metric"}
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
