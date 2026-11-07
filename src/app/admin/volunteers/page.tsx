"use client";

import { useEffect, useState } from "react";
import { Users, Trash2, Mail } from "lucide-react";
import { type Volunteer } from "@/lib/storage";
import { fetchAdminVolunteers, deleteVolunteerFromDb } from "@/lib/supabase/db";
import { motion } from "framer-motion";

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  const loadVolunteers = () => {
    fetchAdminVolunteers().then(setVolunteers);
  };

  useEffect(() => {
    loadVolunteers();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteVolunteerFromDb(id);
    loadVolunteers();
  };

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
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold text-forest"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Volunteers
        </h1>
        <p className="text-sm text-charcoal-light mt-1">
          People who signed up to volunteer
        </p>
      </div>

      {volunteers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-12 border border-forest/5 text-center"
        >
          <Users className="w-12 h-12 text-charcoal-light/20 mx-auto mb-4" />
          <p className="text-charcoal-light">
            No volunteer signups yet.
          </p>
          <p className="text-xs text-charcoal-light/60 mt-1">
            Volunteer registrations from the website will appear here.
          </p>
        </motion.div>
      ) : (
        <div className="bg-white rounded-2xl border border-forest/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-forest/3 border-b border-forest/5">
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                    Phone
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                    Interest
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                    Date
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((vol, i) => (
                  <motion.tr
                    key={vol.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-forest/5 last:border-0 hover:bg-forest/2 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-charcoal">
                      {vol.name}
                    </td>
                    <td className="px-6 py-4 text-charcoal-light">
                      {vol.email}
                    </td>
                    <td className="px-6 py-4 text-charcoal-light">
                      {vol.phone || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green/10 text-green text-xs font-medium rounded-full">
                        {vol.interest}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-charcoal-light text-xs">
                      {formatDate(vol.date)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`mailto:${vol.email}`}
                          className="p-2 rounded-lg text-charcoal-light hover:text-forest hover:bg-forest/5 transition-all"
                          aria-label="Email volunteer"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(vol.id)}
                          className="p-2 rounded-lg text-charcoal-light hover:text-red-500 hover:bg-red-50 transition-all"
                          aria-label="Delete volunteer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
