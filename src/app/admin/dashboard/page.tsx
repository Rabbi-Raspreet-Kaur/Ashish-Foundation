"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  MessageSquare,
  Users,
  IndianRupee,
  Mail,
  UserPlus,
  BookOpen,
  Sparkles,
  BarChart3,
  FileText,
  Settings,
  Calendar,
  ImageIcon,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import {
  fetchAdminStats,
  fetchAdminDonations,
  fetchAdminContacts,
  fetchAdminVolunteers,
} from "@/lib/supabase/db";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalDonationAmount: 0,
    verifiedDonationAmount: 0,
    pendingDonationsCount: 0,
    completedDonationsCount: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalVolunteers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    totalProgrammes: 0,
    publishedProgrammes: 0,
    totalStories: 0,
    publishedStories: 0,
    totalDocs: 0,
    publishedDocs: 0,
  });
  const [recentDonations, setRecentDonations] = useState<
    { name: string; amount: number; date: string; status: "pending" | "completed" }[]
  >([]);
  const [recentMessages, setRecentMessages] = useState<
    { name: string; subject: string; date: string }[]
  >([]);
  const [recentVolunteers, setRecentVolunteers] = useState<
    { name: string; interest: string; date: string }[]
  >([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetchAdminStats(),
      fetchAdminDonations(),
      fetchAdminContacts(),
      fetchAdminVolunteers(),
    ]).then(([s, donations, contacts, volunteers]) => {
      if (!mounted) return;
      setStats(s);
      setRecentDonations(
        donations
          .slice(0, 5)
          .map((d) => ({ name: d.name, amount: d.amount, date: d.date, status: d.status }))
      );
      setRecentMessages(
        contacts
          .slice(0, 5)
          .map((c) => ({ name: c.name, subject: c.subject, date: c.date }))
      );
      setRecentVolunteers(
        volunteers
          .slice(0, 5)
          .map((v) => ({ name: v.name, interest: v.interest, date: v.date }))
      );
    });

    return () => {
      mounted = false;
    };
  }, []);

  const statCards = [
    {
      label: "Total Donations",
      value: stats.totalDonations,
      badge: stats.pendingDonationsCount > 0 ? `${stats.pendingDonationsCount} pending` : undefined,
      icon: Heart,
      color: "bg-saffron/10 text-saffron",
      iconBg: "bg-saffron/10",
      href: "/admin/donations",
    },
    {
      label: "Verified Raised",
      value: `₹${(stats.verifiedDonationAmount || 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-green/10 text-green",
      iconBg: "bg-green/10",
      href: "/admin/donations",
    },
    {
      label: "Messages",
      value: stats.totalMessages,
      badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} new` : undefined,
      icon: MessageSquare,
      color: "bg-forest/10 text-forest",
      iconBg: "bg-forest/10",
      href: "/admin/messages",
    },
    {
      label: "Volunteers",
      value: stats.totalVolunteers,
      icon: Users,
      color: "bg-terracotta/10 text-terracotta",
      iconBg: "bg-terracotta/10",
      href: "/admin/volunteers",
    },
  ];

  const quickLinks = [
    { label: "Donations", desc: "Reconcile pledges", icon: Heart, href: "/admin/donations" },
    { label: "Messages", desc: "Public inquiries", icon: MessageSquare, href: "/admin/messages" },
    { label: "Volunteers", desc: "Applications", icon: Users, href: "/admin/volunteers" },
    { label: "Events", desc: "Drives & camps", icon: Calendar, href: "/admin/events" },
    { label: "Gallery", desc: "Photo assets", icon: ImageIcon, href: "/admin/gallery" },
    { label: "Programmes", desc: `${stats.publishedProgrammes} active`, icon: BookOpen, href: "/admin/programmes" },
    { label: "Stories", desc: `${stats.publishedStories} published`, icon: Sparkles, href: "/admin/stories" },
    { label: "Impact Stats", desc: "Verified metrics", icon: BarChart3, href: "/admin/impact" },
    { label: "Transparency", desc: `${stats.publishedDocs} docs`, icon: FileText, href: "/admin/transparency" },
    { label: "Settings", desc: "Foundation identity", icon: Settings, href: "/admin/settings" },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-saffron/15 text-saffron text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Administrator Portal
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold text-forest"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Foundation Command Center
          </h1>
          <p className="text-sm text-charcoal-light mt-0.5">
            Overview of Ashish Foundation operations, donor submissions, and public content
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest/5 hover:bg-forest/10 text-forest text-xs font-semibold rounded-full transition-all duration-200"
        >
          View Public Website
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((stat, i) => (
          <Link key={stat.label} href={stat.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 border border-forest/10 hover:shadow-md hover:border-forest/20 transition-all cursor-pointer h-full flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color.split(" ")[1]}`} />
                </div>
                {stat.badge && (
                  <span className="px-2 py-0.5 bg-saffron/15 text-saffron-dark text-[11px] font-bold rounded-full">
                    {stat.badge}
                  </span>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-forest" style={{ fontFamily: "var(--font-heading)" }}>
                  {stat.value}
                </p>
                <p className="text-xs text-charcoal-light mt-0.5 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Quick Action Matrix */}
      <div className="bg-white rounded-3xl p-6 border border-forest/10 shadow-sm mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-forest mb-4">
          Management Modules
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {quickLinks.map((ql) => (
            <Link
              key={ql.label}
              href={ql.href}
              className="p-3.5 rounded-2xl bg-offwhite hover:bg-forest hover:text-white transition-all duration-200 group border border-forest/5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <ql.icon className="w-4 h-4 text-saffron group-hover:text-white transition-colors" />
                <ArrowRight className="w-3 h-3 text-charcoal-light/40 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-xs font-bold text-forest group-hover:text-white transition-colors">
                  {ql.label}
                </p>
                <p className="text-[10px] text-charcoal-light group-hover:text-white/70 transition-colors">
                  {ql.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-forest/10 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-saffron" />
              <h2 className="text-sm font-bold text-forest">Recent Donations</h2>
            </div>
            <Link href="/admin/donations" className="text-xs text-forest hover:underline font-medium">
              View all
            </Link>
          </div>
          {recentDonations.length === 0 ? (
            <p className="text-xs text-charcoal-light/60 italic text-center py-8">
              No donation pledges recorded yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentDonations.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-forest/5 last:border-0"
                >
                  <div className="truncate mr-2">
                    <p className="text-xs font-semibold text-charcoal truncate">{d.name}</p>
                    <p className="text-[10px] text-charcoal-light">{formatDate(d.date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-forest block">
                      ₹{d.amount.toLocaleString("en-IN")}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        d.status === "completed"
                          ? "bg-green/10 text-green"
                          : "bg-saffron/15 text-saffron-dark"
                      }`}
                    >
                      {d.status === "completed" ? "Verified" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-forest/10 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-forest" />
              <h2 className="text-sm font-bold text-forest">Recent Inquiries</h2>
            </div>
            <Link href="/admin/messages" className="text-xs text-forest hover:underline font-medium">
              View all
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-xs text-charcoal-light/60 italic text-center py-8">
              No contact messages yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((m, i) => (
                <div key={i} className="py-2 border-b border-forest/5 last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-charcoal truncate">{m.name}</p>
                    <span className="text-[10px] text-charcoal-light/60">{formatDate(m.date)}</span>
                  </div>
                  <p className="text-xs text-charcoal-light truncate mt-0.5">
                    {m.subject || "No subject"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Volunteers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-forest/10 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-terracotta" />
              <h2 className="text-sm font-bold text-forest">Volunteer Applicants</h2>
            </div>
            <Link href="/admin/volunteers" className="text-xs text-forest hover:underline font-medium">
              View all
            </Link>
          </div>
          {recentVolunteers.length === 0 ? (
            <p className="text-xs text-charcoal-light/60 italic text-center py-8">
              No volunteer applications yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentVolunteers.map((v, i) => (
                <div key={i} className="py-2 border-b border-forest/5 last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-charcoal">{v.name}</p>
                    <span className="text-[10px] text-charcoal-light/60">{formatDate(v.date)}</span>
                  </div>
                  <p className="text-xs text-green font-medium mt-0.5">{v.interest}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
