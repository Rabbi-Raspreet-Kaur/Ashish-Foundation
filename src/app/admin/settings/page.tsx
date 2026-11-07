"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  Building,
  Mail,
  Phone,
  MapPin,
  QrCode,
  Share2,
} from "lucide-react";
import { type StoredWebsiteSettings } from "@/lib/storage";
import {
  fetchAdminWebsiteSettings,
  saveAdminWebsiteSettings,
} from "@/lib/supabase/db";
import { motion } from "framer-motion";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoredWebsiteSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchAdminWebsiteSettings().then(setSettings);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    await saveAdminWebsiteSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-3 border-forest/20 border-t-forest rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-forest"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Website & Foundation Settings
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Configure public organisation identity, contact channels, and UPI donation parameters
          </p>
        </div>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 mb-6 bg-green/15 border border-green/30 rounded-2xl flex items-center gap-3 text-forest text-sm font-semibold shadow-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-green shrink-0" />
          Settings successfully updated and saved across the foundation platform!
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Foundation Identity */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-forest/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-forest/10">
            <Building className="w-5 h-5 text-saffron" />
            <h2 className="text-base font-bold text-forest" style={{ fontFamily: "var(--font-heading)" }}>
              Organisation Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Foundation Name
              </label>
              <input
                type="text"
                required
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                required
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
              Mission Description
            </label>
            <textarea
              rows={3}
              required
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-forest/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-forest/10">
            <Mail className="w-5 h-5 text-saffron" />
            <h2 className="text-base font-bold text-forest" style={{ fontFamily: "var(--font-heading)" }}>
              Contact & Location
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Official Email
              </label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Operational City/Region
              </label>
              <input
                type="text"
                required
                value={settings.location}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Physical Office Address
              </label>
              <input
                type="text"
                required
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
              />
            </div>
          </div>
        </div>

        {/* UPI Donation Configuration */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-forest/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-forest/10">
            <QrCode className="w-5 h-5 text-saffron" />
            <h2 className="text-base font-bold text-forest" style={{ fontFamily: "var(--font-heading)" }}>
              Verified UPI Payment Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                UPI ID (VPA)
              </label>
              <input
                type="text"
                required
                value={settings.upiId}
                onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
              />
              <span className="text-[11px] text-green font-medium mt-1 block">
                Verified Bank Account: 8299052548m@pnb
              </span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Payee Legal Name
              </label>
              <input
                type="text"
                required
                value={settings.upiName}
                onChange={(e) => setSettings({ ...settings, upiName: e.target.value })}
                className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-forest/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-forest/10">
            <Share2 className="w-5 h-5 text-saffron" />
            <h2 className="text-base font-bold text-forest" style={{ fontFamily: "var(--font-heading)" }}>
              Social Media Channels
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Instagram URL
              </label>
              <input
                type="text"
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Facebook URL
              </label>
              <input
                type="text"
                value={settings.facebook}
                onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                className="w-full px-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-forest hover:bg-forest-light text-white font-semibold text-sm rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
