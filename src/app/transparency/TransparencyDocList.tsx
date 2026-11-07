"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { TRANSPARENCY_DOCS } from "@/lib/constants";
import { fetchPublicTransparencyDocs } from "@/lib/supabase/db";
import { type StoredTransparencyDoc } from "@/lib/storage";

export default function TransparencyDocList() {
  const [docs, setDocs] = useState<StoredTransparencyDoc[]>(() =>
    TRANSPARENCY_DOCS.map((doc, idx) => ({
      id: "doc-" + (idx + 1),
      title: doc.title,
      description: doc.description,
      fileUrl: "",
      available: doc.available,
      published: true,
    }))
  );

  useEffect(() => {
    let mounted = true;
    fetchPublicTransparencyDocs().then((data) => {
      if (mounted && data && data.length > 0) {
        setDocs(data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {docs.map((doc, i) => (
        <ScrollReveal key={doc.id || doc.title} delay={i * 0.08}>
          <div className="bg-white rounded-2xl p-6 border border-forest/5 hover:border-green/20 transition-all duration-500 hover:shadow-lg h-full flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-forest/5 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-forest" />
                </div>
                {doc.available ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green/10 text-green text-xs font-semibold rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-saffron/10 text-saffron text-xs font-semibold rounded-full">
                    <Clock className="w-3 h-3" />
                    In Preparation
                  </span>
                )}
              </div>

              <h3
                className="text-lg font-semibold text-forest mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {doc.title}
              </h3>
              <p className="text-sm text-charcoal-light leading-relaxed mb-4">
                {doc.description}
              </p>
            </div>

            <div className="pt-2">
              {doc.available && doc.fileUrl ? (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-green hover:text-forest transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Document
                </a>
              ) : doc.available ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-forest/70">
                  <CheckCircle className="w-3.5 h-3.5 text-green" />
                  Available upon written request
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs text-charcoal-light/60">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Pending verification & audit
                </span>
              )}
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
