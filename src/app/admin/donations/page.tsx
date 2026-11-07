"use client";

import { useEffect, useState } from "react";
import { Heart, Trash2, IndianRupee, Clock, CheckCircle2 } from "lucide-react";
import { type Donation } from "@/lib/storage";
import {
  fetchAdminDonations,
  deleteDonationFromDb,
  updateDonationStatusInDb,
} from "@/lib/supabase/db";
import { motion } from "framer-motion";

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);

  const loadDonations = () => {
    fetchAdminDonations().then(setDonations);
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDonationFromDb(id);
    loadDonations();
  };

  const handleToggleStatus = async (id: string, currentStatus: "pending" | "completed") => {
    const nextStatus = currentStatus === "pending" ? "completed" : "pending";
    await updateDonationStatusInDb(id, nextStatus);
    loadDonations();
  };

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const verifiedAmount = donations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + d.amount, 0);
  const pendingCount = donations.filter((d) => d.status === "pending").length;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-forest"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Donations
          </h1>
          <p className="text-sm text-charcoal-light mt-1">
            Donation submissions and bank reconciliation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-forest/5 text-forest px-4 py-2 rounded-xl text-xs font-medium">
            Total Pledged: <span className="font-bold">₹{totalAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="bg-green/10 text-green px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4" />
            Verified: ₹{verifiedAmount.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {pendingCount > 0 && (
        <div className="mb-6 bg-saffron/10 border border-saffron/30 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-saffron shrink-0" />
            <p className="text-xs md:text-sm text-forest font-medium">
              You have <span className="font-bold">{pendingCount} donation{pendingCount > 1 ? "s" : ""}</span> awaiting bank verification. Compare against your Punjab National Bank statement before marking as verified.
            </p>
          </div>
        </div>
      )}

      {donations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-12 border border-forest/5 text-center"
        >
          <Heart className="w-12 h-12 text-charcoal-light/20 mx-auto mb-4" />
          <p className="text-charcoal-light">No donations recorded yet.</p>
          <p className="text-xs text-charcoal-light/60 mt-1">
            Donation intents submitted on the website will appear here for reconciliation.
          </p>
        </motion.div>
      ) : (
        <div className="bg-white rounded-2xl border border-forest/5 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-forest/5 border-b border-forest/10">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                    Donor
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                    Email
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                    Amount
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                    Date
                  </th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                    Verification Status
                  </th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation, i) => (
                  <motion.tr
                    key={donation.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-forest/5 last:border-0 hover:bg-forest/2 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-charcoal">
                      {donation.name}
                    </td>
                    <td className="px-6 py-4 text-charcoal-light">
                      {donation.email}
                    </td>
                    <td className="px-6 py-4 font-semibold text-forest">
                      ₹{donation.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-charcoal-light text-xs">
                      {formatDate(donation.date)}
                    </td>
                    <td className="px-6 py-4">
                      {donation.status === "completed" ? (
                        <button
                          onClick={() => handleToggleStatus(donation.id, donation.status)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green/10 text-green hover:bg-green/20 text-xs font-medium rounded-full transition-colors"
                          title="Click to revert to pending"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(donation.id, donation.status)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-saffron/15 text-saffron-dark hover:bg-saffron/25 text-xs font-medium rounded-full transition-colors"
                          title="Click to mark as verified after bank check"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Pending Bank Check
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(donation.id)}
                        className="p-2 rounded-lg text-charcoal-light hover:text-red-500 hover:bg-red-50 transition-all"
                        aria-label="Delete donation"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
