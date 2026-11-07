"use client";

import { useEffect, useState } from "react";
import { Trash2, Eye, Mail } from "lucide-react";
import { type ContactMessage } from "@/lib/storage";
import {
  fetchAdminContacts,
  deleteContactFromDb,
  markContactReadInDb,
} from "@/lib/supabase/db";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const loadMessages = () => {
    fetchAdminContacts().then(setMessages);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteContactFromDb(id);
    loadMessages();
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  const handleView = async (msg: ContactMessage) => {
    if (!msg.read) {
      await markContactReadInDb(msg.id);
      loadMessages();
    }
    setSelectedMessage(msg);
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
          Messages
        </h1>
        <p className="text-sm text-charcoal-light mt-1">
          Contact form submissions
        </p>
      </div>

      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-12 border border-forest/5 text-center"
        >
          <Mail className="w-12 h-12 text-charcoal-light/20 mx-auto mb-4" />
          <p className="text-charcoal-light">No messages received yet.</p>
          <p className="text-xs text-charcoal-light/60 mt-1">
            Messages from the contact form will appear here.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Message list */}
          <div className="bg-white rounded-2xl border border-forest/5 overflow-hidden">
            <div className="divide-y divide-forest/5">
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleView(msg)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-forest/2 ${
                    selectedMessage?.id === msg.id ? "bg-green/5" : ""
                  } ${!msg.read ? "border-l-3 border-l-saffron" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm truncate ${
                            msg.read
                              ? "text-charcoal font-medium"
                              : "text-forest font-bold"
                          }`}
                        >
                          {msg.name}
                        </p>
                        {!msg.read && (
                          <span className="w-2 h-2 rounded-full bg-saffron flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-charcoal-light truncate">
                        {msg.subject || "No subject"}
                      </p>
                      <p className="text-xs text-charcoal-light/60 mt-1">
                        {formatDate(msg.date)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(msg.id);
                      }}
                      className="p-1.5 rounded-lg text-charcoal-light hover:text-red-500 hover:bg-red-50 transition-all"
                      aria-label="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Message detail */}
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-2xl p-6 border border-forest/5"
              >
                <div className="mb-6">
                  <h2
                    className="text-lg font-bold text-forest"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {selectedMessage.subject || "No Subject"}
                  </h2>
                  <p className="text-xs text-charcoal-light mt-1">
                    From: {selectedMessage.name} ({selectedMessage.email})
                  </p>
                  <p className="text-xs text-charcoal-light/60 mt-0.5">
                    {formatDate(selectedMessage.date)}
                  </p>
                </div>
                <div className="bg-offwhite rounded-xl p-4">
                  <p className="text-sm text-charcoal leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
                <div className="mt-4">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-white text-sm font-medium rounded-full hover:bg-forest-light transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Reply via Email
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-12 border border-forest/5 flex items-center justify-center"
              >
                <div className="text-center">
                  <Eye className="w-10 h-10 text-charcoal-light/20 mx-auto mb-3" />
                  <p className="text-sm text-charcoal-light">
                    Select a message to view
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
