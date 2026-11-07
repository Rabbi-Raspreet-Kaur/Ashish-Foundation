"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, RefreshCw } from "lucide-react";
import { DONATION_CONFIG, buildStandardUpiUri } from "@/config/donation";
import QRCode from "qrcode";

interface UpiQrCodeProps {
  amount?: number | null;
  size?: number;
  className?: string;
  showAmountBadge?: boolean;
  showDownload?: boolean;
  note?: string;
}

export default function UpiQrCode({
  amount = null,
  size = 220,
  className = "",
  showAmountBadge = true,
  showDownload = true,
  note,
}: UpiQrCodeProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // Compute the standard UPI URI
  const upiUri = buildStandardUpiUri(amount, note);

  useEffect(() => {
    let isMounted = true;

    async function generateQr() {
      await Promise.resolve();
      if (!isMounted) return;
      setGenerating(true);

      try {
        // 1. Generate clean SVG vector for sharp display
        const svg = await QRCode.toString(upiUri, {
          type: "svg",
          margin: 4,
          errorCorrectionLevel: "M",
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });

        // 2. Generate high-res DataURL for download capability
        const pngUrl = await QRCode.toDataURL(upiUri, {
          width: 1200,
          margin: 4,
          errorCorrectionLevel: "M",
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });

        if (isMounted) {
          setSvgContent(svg);
          setDataUrl(pngUrl);
          setGenerating(false);
        }
      } catch (err) {
        console.error("Failed to generate dynamic UPI QR code:", err);
        if (isMounted) {
          setGenerating(false);
        }
      }
    }

    generateQr();

    return () => {
      isMounted = false;
    };
  }, [upiUri]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    const amountLabel = amount && amount > 0 ? `-${amount}` : "";
    link.download = `ashish-foundation-upi-qr${amountLabel}.png`;
    link.href = dataUrl;
    link.click();
  };

  const formattedAmount =
    amount && amount > 0 ? `₹${amount.toLocaleString("en-IN")}` : null;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* QR Code Container */}
      <div
        className="relative bg-white rounded-2xl border-2 border-forest/10 p-3 shadow-md flex items-center justify-center overflow-hidden aspect-square"
        style={{ width: size, height: size }}
      >
        {svgContent ? (
          <div
            className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:shape-rendering-crispEdges"
            dangerouslySetInnerHTML={{ __html: svgContent }}
            aria-label={`UPI QR Code for ${DONATION_CONFIG.payeeName}${formattedAmount ? ` of amount ${formattedAmount}` : ""}`}
            role="img"
          />
        ) : (
          /* Server-side / Hydration fallback image */
          <div className="relative w-full h-full">
            <Image
              src="/images/donation-qr.png"
              alt={`Scan with any UPI app to donate to ${DONATION_CONFIG.payeeName}`}
              fill
              priority
              sizes={`${size}px`}
              className="object-contain p-1"
            />
          </div>
        )}

        {/* Loading overlay */}
        {generating && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center transition-opacity">
            <RefreshCw className="w-6 h-6 text-saffron animate-spin" />
          </div>
        )}
      </div>

      {/* Amount indicator badge */}
      {showAmountBadge && (
        <div className="mt-3 text-center">
          {formattedAmount ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest text-white shadow-sm">
              Preset Amount: {formattedAmount}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-charcoal-light bg-forest/5">
              Enter any amount in your UPI app
            </span>
          )}
        </div>
      )}

      {/* Download action for mobile users saving to gallery */}
      {showDownload && dataUrl && (
        <button
          type="button"
          onClick={handleDownload}
          className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-forest hover:text-green transition-colors focus:outline-none"
          title="Save QR image to gallery for scanning inside Google Pay or PhonePe"
        >
          <Download className="w-3.5 h-3.5" />
          Save QR to Photos
        </button>
      )}
    </div>
  );
}
