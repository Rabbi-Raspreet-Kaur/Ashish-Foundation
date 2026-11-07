"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  X,
  Shield,
} from "lucide-react";
import { type StoredTransparencyDoc } from "@/lib/storage";
import {
  fetchAdminTransparencyDocs,
  saveAdminTransparencyDoc,
  deleteAdminTransparencyDoc,
  togglePublishTransparencyDocInDb,
  toggleAvailableTransparencyDocInDb,
} from "@/lib/supabase/db";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminTransparencyPage() {
  const [docs, setDocs] = useState<StoredTransparencyDoc[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    available: false,
    published: true,
  });

  const loadData = () => {
    fetchAdminTransparencyDocs().then(setDocs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      fileUrl: "",
      available: false,
      published: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (doc: StoredTransparencyDoc) => {
    setEditingId(doc.id);
    setFormData({
      title: doc.title,
      description: doc.description,
      fileUrl: doc.fileUrl || "",
      available: doc.available,
      published: doc.published,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    await saveAdminTransparencyDoc({
      id: editingId || undefined,
      title: formData.title.trim(),
      description: formData.description.trim(),
      fileUrl: formData.fileUrl.trim(),
      available: formData.available,
      published: formData.published,
    });

    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this document entry?")) {
      await deleteAdminTransparencyDoc(id);
      loadData();
    }
  };

  const handleTogglePublish = async (id: string) => {
    await togglePublishTransparencyDocInDb(id);
    loadData();
  };

  const handleToggleAvailable = async (id: string) => {
    await toggleAvailableTransparencyDocInDb(id);
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
            Transparency & Governance
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Manage official certificates, annual reports, audited accounts, and availability status
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest hover:bg-forest-light text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Document Entry
        </button>
      </div>

      <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <Shield className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          <strong>Accuracy Notice:</strong> Documents marked as &ldquo;Available&rdquo; must be backed by genuine verified PDF filings. Documents in preparation or pending audit should be marked &ldquo;Under Preparation&rdquo; to maintain trust with public donors.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-forest/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-forest/5 text-forest text-xs uppercase tracking-wider font-semibold border-b border-forest/10">
                <th className="p-4">Document Title</th>
                <th className="p-4">Description</th>
                <th className="p-4">Availability</th>
                <th className="p-4">Public Visibility</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/5 text-xs text-charcoal">
              {docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-offwhite transition-colors">
                  <td className="p-4 font-semibold text-forest flex items-center gap-2">
                    <FileText className="w-4 h-4 text-saffron shrink-0" />
                    {doc.title}
                  </td>
                  <td className="p-4 text-charcoal-light max-w-xs">{doc.description}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleAvailable(doc.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        doc.available
                          ? "bg-green/15 text-green hover:bg-green/25"
                          : "bg-charcoal/10 text-charcoal-light hover:bg-charcoal/20"
                      }`}
                    >
                      {doc.available ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Available
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" /> Under Preparation
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleTogglePublish(doc.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                        doc.published
                          ? "bg-forest/10 text-forest"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {doc.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {doc.published ? "Published" : "Hidden"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(doc)}
                        className="p-1.5 text-charcoal-light hover:text-forest hover:bg-forest/5 rounded-lg"
                        title="Edit Document"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-1.5 text-charcoal-light hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-forest/10">
                <h3
                  className="text-xl font-bold text-forest"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {editingId ? "Edit Transparency Doc" : "Add Transparency Doc"}
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
                    Document Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Audited Financial Statements FY 2025-26"
                    className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short summary of this document..."
                    className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                    Download File URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    placeholder="https://... or /documents/report.pdf"
                    className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="doc-available"
                      checked={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                      className="w-4 h-4 text-green rounded focus:ring-green"
                    />
                    <label htmlFor="doc-available" className="text-xs font-medium text-charcoal">
                      File is verified & available for download
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="doc-published"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4 text-green rounded focus:ring-green"
                    />
                    <label htmlFor="doc-published" className="text-xs font-medium text-charcoal">
                      Published on public Transparency page
                    </label>
                  </div>
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
                    {editingId ? "Save Changes" : "Save Document"}
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
