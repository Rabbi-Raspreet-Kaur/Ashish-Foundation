"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Heart,
  Calendar,
  Shield,
  IndianRupee,
  Clock,
  CheckCircle2,
  Save,
  Mail,
  Phone,
  QrCode,
  ArrowRight,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { fetchAdminDonations } from "@/lib/supabase/db";
import { getEventRegistrations, type Donation, type EventRegistration } from "@/lib/storage";
import UpiQrCode from "@/components/ui/UpiQrCode";

export default function UserDashboardPage() {
  const { user, updateProfile, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "donations" | "events" | "profile">("overview");

  // Profile Form state
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Donations state
  const [userDonations, setUserDonations] = useState<Donation[]>([]);
  const [loadingDonations, setLoadingDonations] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);

  // Events state
  const [userEvents, setUserEvents] = useState<EventRegistration[]>([]);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  // Load user-specific donations and event registrations
  useEffect(() => {
    if (!user?.email) return;
    const userEmail = user.email.toLowerCase();

    // 1. Fetch donations and filter strictly to current user's email
    fetchAdminDonations().then((all) => {
      const filtered = all.filter((d) => d.email.toLowerCase() === userEmail);
      setUserDonations(filtered);
      setLoadingDonations(false);
    });

    // 2. Fetch event registrations for this user
    try {
      const allRegs = getEventRegistrations();
      const filteredRegs = allRegs.filter((r) => r.email.toLowerCase() === userEmail);
      setUserEvents(filteredRegs);
    } catch {}
  }, [user]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSaved(false);

    if (!name.trim()) {
      setProfileError("Name cannot be empty.");
      return;
    }

    const res = updateProfile({ name, phone });
    if (res.success) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } else {
      setProfileError(res.error || "Failed to update profile.");
    }
  };

  const totalDonated = userDonations.reduce((sum, d) => sum + d.amount, 0);
  const completedDonated = userDonations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + d.amount, 0);
  const pendingCount = userDonations.filter((d) => d.status === "pending").length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-forest via-forest-light to-forest text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
          <div className="w-64 h-64 rounded-full bg-saffron blur-3xl ml-auto" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 text-saffron">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase bg-white/15 text-saffron rounded-full">
                  {user?.role === "admin" ? "Administrator" : "Verified Supporter"}
                </span>
                <span className="text-xs text-white/60">• Personal Portal</span>
              </div>
              <h1
                className="text-2xl md:text-3xl font-bold tracking-tight text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Welcome back, {user?.name || "Friend"}!
              </h1>
              <p className="text-xs md:text-sm text-white/70 mt-1">
                Signed in as <span className="text-white font-medium">{user?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDonateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-saffron hover:bg-saffron-dark text-white font-semibold text-xs rounded-full transition-all duration-200 shadow-md shadow-saffron/30 hover:scale-105"
            >
              <Heart className="w-3.5 h-3.5" />
              Make a Donation
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-forest/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
            activeTab === "overview"
              ? "bg-forest text-white"
              : "text-charcoal hover:bg-forest/5"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("donations")}
          className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
            activeTab === "donations"
              ? "bg-forest text-white"
              : "text-charcoal hover:bg-forest/5"
          }`}
        >
          My Donations ({userDonations.length})
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
            activeTab === "events"
              ? "bg-forest text-white"
              : "text-charcoal hover:bg-forest/5"
          }`}
        >
          My Events ({userEvents.length})
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
            activeTab === "profile"
              ? "bg-forest text-white"
              : "text-charcoal hover:bg-forest/5"
          }`}
        >
          Profile Settings
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-forest/5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-charcoal-light uppercase tracking-wider">
                  Total Contributed
                </span>
                <div className="w-9 h-9 rounded-xl bg-saffron/10 text-saffron flex items-center justify-center">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <div
                className="text-2xl font-bold text-forest"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                ₹{totalDonated.toLocaleString("en-IN")}
              </div>
              <p className="text-[11px] text-charcoal-light mt-1">
                Verified: ₹{completedDonated.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-forest/5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-charcoal-light uppercase tracking-wider">
                  Donation Count
                </span>
                <div className="w-9 h-9 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
              </div>
              <div
                className="text-2xl font-bold text-forest"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {userDonations.length}
              </div>
              <p className="text-[11px] text-charcoal-light mt-1">
                {pendingCount > 0 ? `${pendingCount} awaiting receipt review` : "All donations accounted for"}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-forest/5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-charcoal-light uppercase tracking-wider">
                  Events Attending
                </span>
                <div className="w-9 h-9 rounded-xl bg-green/10 text-green flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div
                className="text-2xl font-bold text-forest"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {userEvents.length}
              </div>
              <p className="text-[11px] text-charcoal-light mt-1">
                Community programmes & camps
              </p>
            </div>
          </div>

          {/* Quick Profile Summary & Security Notice */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-forest/5 shadow-sm space-y-4">
              <h2
                className="text-base font-bold text-forest"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Account Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-offwhite rounded-xl">
                  <span className="text-charcoal-light uppercase tracking-wider block mb-1">
                    Display Name
                  </span>
                  <span className="font-semibold text-charcoal text-sm">{user?.name}</span>
                </div>
                <div className="p-3.5 bg-offwhite rounded-xl">
                  <span className="text-charcoal-light uppercase tracking-wider block mb-1">
                    Registered Email
                  </span>
                  <span className="font-semibold text-charcoal text-sm">{user?.email}</span>
                </div>
                <div className="p-3.5 bg-offwhite rounded-xl">
                  <span className="text-charcoal-light uppercase tracking-wider block mb-1">
                    Account Role
                  </span>
                  <span className="font-semibold text-forest text-sm capitalize">
                    {user?.role} (Standard User)
                  </span>
                </div>
                <div className="p-3.5 bg-offwhite rounded-xl">
                  <span className="text-charcoal-light uppercase tracking-wider block mb-1">
                    Access Level
                  </span>
                  <span className="font-semibold text-green text-sm">
                    Supporter & Donor Access
                  </span>
                </div>
              </div>
            </div>

            {/* Standard User Security Notice */}
            <div className="bg-forest/5 rounded-2xl p-6 border border-forest/10 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5" />
                </div>
                <h3
                  className="text-sm font-bold text-forest mb-1.5"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Role-Based Privacy
                </h3>
                <p className="text-xs text-charcoal-light leading-relaxed">
                  You are signed in with standard user permissions. Administrative operations (such as publishing site content, updating verified records, and viewing other users) are strictly restricted to verified administrators.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-4 text-xs font-semibold text-forest hover:text-green inline-flex items-center gap-1"
              >
                Need help or have questions? Contact us <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Donations */}
      {activeTab === "donations" && (
        <div className="bg-white rounded-2xl p-6 border border-forest/5 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2
                className="text-lg font-bold text-forest"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                My Giving History
              </h2>
              <p className="text-xs text-charcoal-light">
                All donations and pledges recorded under your account
              </p>
            </div>
            <button
              onClick={() => setShowDonateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-saffron hover:bg-saffron-dark text-white font-semibold text-xs rounded-full transition-colors self-start sm:self-auto"
            >
              <Heart className="w-3.5 h-3.5" />
              Donate Again
            </button>
          </div>

          {loadingDonations ? (
            <div className="py-12 text-center text-xs text-charcoal-light">
              Loading donation history...
            </div>
          ) : userDonations.length === 0 ? (
            <div className="py-12 text-center bg-offwhite/50 rounded-2xl border border-dashed border-forest/10">
              <div className="w-12 h-12 rounded-2xl bg-saffron/10 text-saffron flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-forest mb-1">
                No Donations Recorded Yet
              </p>
              <p className="text-xs text-charcoal-light max-w-sm mx-auto mb-4">
                Thank you for being part of Ashish Foundation. When you donate via our verified UPI QR code, your contribution history will be displayed here.
              </p>
              <button
                onClick={() => setShowDonateModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest hover:bg-forest-light text-white font-semibold text-xs rounded-full transition-colors"
              >
                <Heart className="w-3.5 h-3.5" />
                Make Your First Contribution
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-forest/10 text-charcoal-light uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Receipt / Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest/5">
                  {userDonations.map((d) => (
                    <tr key={d.id} className="hover:bg-offwhite/50 transition-colors">
                      <td className="py-3.5 px-3 text-charcoal font-medium">
                        {new Date(d.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-forest text-sm">
                        ₹{d.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-3">
                        {d.status === "completed" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green/10 text-green font-semibold rounded-full text-[11px]">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-600 font-semibold rounded-full text-[11px]">
                            <Clock className="w-3 h-3" />
                            Pending Verification
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-charcoal-light">
                        {d.status === "completed" ? (
                          <span className="text-forest font-medium">Verified by Foundation</span>
                        ) : (
                          <span>Under reconciliation</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Events */}
      {activeTab === "events" && (
        <div className="bg-white rounded-2xl p-6 border border-forest/5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2
                className="text-lg font-bold text-forest"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                My Event Registrations
              </h2>
              <p className="text-xs text-charcoal-light">
                Drives and community camps you have signed up for
              </p>
            </div>
            <Link
              href="/#events"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-green"
            >
              Browse All Events <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {userEvents.length === 0 ? (
            <div className="py-12 text-center bg-offwhite/50 rounded-2xl border border-dashed border-forest/10">
              <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-forest mb-1">
                No Event Registrations Found
              </p>
              <p className="text-xs text-charcoal-light max-w-sm mx-auto mb-4">
                You haven&apos;t registered for any foundation camps or drives yet. Check our upcoming events on the public website.
              </p>
              <Link
                href="/#events"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest hover:bg-forest-light text-white font-semibold text-xs rounded-full transition-colors"
              >
                View Upcoming Events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userEvents.map((ev) => (
                <div key={ev.id} className="p-4 bg-offwhite rounded-xl border border-forest/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-saffron uppercase tracking-wider">
                      Confirmed RSVP
                    </span>
                    <span className="text-[11px] text-charcoal-light">
                      {new Date(ev.date).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-forest">{ev.eventTitle}</h3>
                  <p className="text-xs text-charcoal-light">
                    Registered as: <span className="font-medium text-charcoal">{ev.name}</span> ({ev.phone})
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Profile Settings */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl p-6 border border-forest/5 shadow-sm max-w-xl space-y-6">
          <div>
            <h2
              className="text-lg font-bold text-forest"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Update Profile Details
            </h2>
            <p className="text-xs text-charcoal-light">
              Manage your permitted personal contact information
            </p>
          </div>

          {profileSaved && (
            <div className="flex items-center gap-2 p-3 bg-green/10 border border-green/30 rounded-xl text-forest text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-green" />
              <span>Your profile details have been saved successfully.</span>
            </div>
          )}

          {profileError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
              <AlertCircle className="w-4 h-4" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light/60" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full pl-10 pr-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light/60" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 bg-offwhite border border-forest/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-green"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Email Address (Read Only)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light/60" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full pl-10 pr-4 py-2.5 bg-offwhite/50 border border-forest/5 rounded-xl text-sm text-charcoal-light cursor-not-allowed"
                />
              </div>
              <span className="text-[11px] text-charcoal-light/70 mt-1 block">
                Email address is tied to your account credentials.
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded-full transition-colors shadow-sm"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Donation Modal / UPI QR View */}
      {showDonateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-forest/5 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-saffron fill-saffron" />
                <h3
                  className="text-base font-bold text-forest"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Contribute via UPI
                </h3>
              </div>
              <button
                onClick={() => setShowDonateModal(false)}
                className="p-1 rounded-full text-charcoal-light hover:text-charcoal transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <UpiQrCode amount={500} />
              <div className="mt-4 p-3 bg-offwhite rounded-xl text-xs text-charcoal-light w-full">
                <p className="font-semibold text-charcoal">Verified Foundation UPI ID:</p>
                <p className="font-mono text-forest font-bold text-sm mt-0.5">8299052548m@pnb</p>
                <p className="text-[11px] text-charcoal-light mt-1">Recipient: Ashish Foundation</p>
              </div>
            </div>

            <button
              onClick={() => setShowDonateModal(false)}
              className="w-full py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded-full transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
