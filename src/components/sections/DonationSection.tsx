"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  BookOpen,
  Users,
  Stethoscope,
  Home,
  CheckCircle,
  QrCode,
  Smartphone,
  Copy,
  X,
  Clock,
  Info,
  ExternalLink,
} from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Modal from "@/components/ui/Modal";
import UpiQrCode from "@/components/ui/UpiQrCode";
import { DONATION_AMOUNTS } from "@/lib/constants";
import { addDonation } from "@/lib/storage";
import { submitDonationPledge } from "@/app/actions/submit";
import { DONATION_CONFIG, buildAppUpiUrl } from "@/config/donation";

const allocationItems = [
  { label: "Education & Learning", icon: BookOpen, percentage: "--", color: "bg-forest" },
  { label: "Women Empowerment", icon: Users, percentage: "--", color: "bg-green" },
  { label: "Healthcare", icon: Stethoscope, percentage: "--", color: "bg-saffron" },
  { label: "Community Support", icon: Home, percentage: "--", color: "bg-terracotta" },
];

export default function DonationSection() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [showDonateForm, setShowDonateForm] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [step, setStep] = useState<"details" | "payment">("details");
  const [copied, setCopied] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmProgress, setConfirmProgress] = useState(0);
  const [desktopNotice, setDesktopNotice] = useState<string | null>(null);

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const finalAmount = selectedAmount || Number(customAmount) || 0;

  const handleDonateClick = () => {
    if (finalAmount <= 0) return;
    setStep("details");
    setShowDonateForm(true);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorEmail || finalAmount <= 0) return;

    // Record locally for immediate UI preview
    addDonation({
      name: donorName,
      email: donorEmail,
      amount: finalAmount,
      status: "pending",
    });

    // Submit securely to Supabase database via server action
    submitDonationPledge({
      name: donorName,
      email: donorEmail,
      amount: finalAmount,
    }).catch((err) => {
      console.warn("[Donation] Failed to sync pledge to Supabase:", err);
    });

    setStep("payment");
  };

  const handleDone = () => {
    setShowDonateForm(false);
    setShowConfirmation(true);
    setConfirmProgress(0);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setConfirmProgress(0);
    setStep("details");
    setDonorName("");
    setDonorEmail("");
    setSelectedAmount(1000);
    setCustomAmount("");
  };

  // Auto-close confirmation after 8 seconds, with progress
  useEffect(() => {
    if (!showConfirmation) return;
    const startTime = Date.now();
    const duration = 8000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setConfirmProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        closeConfirmation();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [showConfirmation]);

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(DONATION_CONFIG.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const closeModal = () => {
    setShowDonateForm(false);
    setStep("details");
  };

  // Safe handler for UPI app links on desktop
  const handleAppClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    appName: string
  ) => {
    const isMobile =
      typeof navigator !== "undefined" &&
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (!isMobile) {
      e.preventDefault();
      setDesktopNotice(
        `UPI app links (${appName}) only open directly on mobile phones. On desktop, please scan the QR code using your mobile UPI app, or copy our UPI ID (${DONATION_CONFIG.upiId}).`
      );
    }
  };

  return (
    <>
      <section
        id="donate"
        className="section-padding bg-cream"
        aria-label="Donate"
      >
        <div className="container-narrow mx-auto">
          <ScrollReveal className="text-center mb-12 md:mb-16">
            <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-saffron border border-saffron/30 rounded-full bg-saffron/10 mb-6">
              Support Us
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-forest leading-tight tracking-tight mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Your Support Matters
            </h2>
            <p className="text-lg text-charcoal-light max-w-xl mx-auto">
              Every contribution, regardless of size, helps us create
              opportunities and change lives.
            </p>
            <div className="mt-6 h-1 w-16 rounded-full bg-saffron mx-auto" />
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-10 items-start">
            {/* Donation Form */}
            <ScrollReveal className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 md:p-10 border border-forest/5 shadow-sm">
                <h3
                  className="text-xl font-semibold text-forest mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Choose an Amount
                </h3>

                {/* Amount Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {DONATION_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountClick(amount)}
                      className={`px-4 py-4 rounded-xl text-base font-semibold transition-all duration-300 border-2 ${
                        selectedAmount === amount
                          ? "bg-forest text-white border-forest shadow-lg shadow-forest/20"
                          : "bg-forest/5 text-forest border-transparent hover:border-green/30 hover:bg-green/10"
                      }`}
                    >
                      ₹{amount.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-8">
                  <label
                    htmlFor="custom-amount"
                    className="block text-sm font-medium text-charcoal mb-2"
                  >
                    Custom Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light font-medium">
                      ₹
                    </span>
                    <input
                      id="custom-amount"
                      type="number"
                      min="1"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={handleCustomChange}
                      className="w-full pl-8 pr-4 py-3.5 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Donate Button */}
                <button
                  onClick={handleDonateClick}
                  disabled={finalAmount <= 0}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-saffron hover:bg-saffron-dark text-white font-bold text-lg rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-saffron/25 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Heart className="w-5 h-5" />
                  Donate{finalAmount > 0 ? ` ₹${finalAmount.toLocaleString("en-IN")}` : " Now"}
                </button>
              </div>
            </ScrollReveal>

            {/* QR Code Section */}
            <ScrollReveal delay={0.1} className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 border border-forest/5 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-6 h-6 text-saffron" />
                </div>
                <h3
                  className="text-xl font-semibold text-forest mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Scan to Donate
                </h3>
                <p className="text-sm text-charcoal-light mb-5">
                  Use any UPI app — GPay, PhonePe, Paytm — to scan and donate instantly
                </p>

                {/* Production-Ready Dynamic QR Code with Amount Synchronization */}
                <div className="mb-5 flex justify-center">
                  <UpiQrCode
                    amount={finalAmount > 0 ? finalAmount : null}
                    size={220}
                    showAmountBadge={true}
                    showDownload={true}
                  />
                </div>

                <div className="bg-cream rounded-2xl p-4 mb-4 border border-forest/5">
                  <p className="text-xs font-semibold text-forest uppercase tracking-wider">
                    {DONATION_CONFIG.payeeName}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-1.5">
                    <p className="text-xs text-charcoal font-mono font-semibold">
                      {DONATION_CONFIG.upiId}
                    </p>
                    <button
                      onClick={copyUpiId}
                      className="p-1 rounded-md text-green hover:text-forest hover:bg-green/10 transition-colors"
                      title="Copy UPI ID"
                      aria-label="Copy UPI ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {copied && (
                    <p className="text-[11px] text-green mt-1 font-semibold">
                      UPI ID copied to clipboard!
                    </p>
                  )}
                </div>

                {/* UPI App Quick Links */}
                <div>
                  <p className="text-xs text-charcoal-light mb-3 flex items-center justify-center gap-1">
                    <Smartphone className="w-3.5 h-3.5" /> Open directly in app
                  </p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    <a
                      href={buildAppUpiUrl("universal", finalAmount > 0 ? finalAmount : null)}
                      onClick={(e) => handleAppClick(e, "UPI App")}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-forest text-white hover:bg-forest/90 transition-all duration-200 shadow-sm"
                    >
                      Any UPI App
                    </a>
                    <a
                      href={buildAppUpiUrl("gpay", finalAmount > 0 ? finalAmount : null)}
                      onClick={(e) => handleAppClick(e, "Google Pay")}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-forest/5 text-forest hover:bg-forest hover:text-white transition-all duration-200 border border-forest/10"
                    >
                      GPay
                    </a>
                    <a
                      href={buildAppUpiUrl("phonepe", finalAmount > 0 ? finalAmount : null)}
                      onClick={(e) => handleAppClick(e, "PhonePe")}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-forest/5 text-forest hover:bg-forest hover:text-white transition-all duration-200 border border-forest/10"
                    >
                      PhonePe
                    </a>
                    <a
                      href={buildAppUpiUrl("paytm", finalAmount > 0 ? finalAmount : null)}
                      onClick={(e) => handleAppClick(e, "Paytm")}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-forest/5 text-forest hover:bg-forest hover:text-white transition-all duration-200 border border-forest/10"
                    >
                      Paytm
                    </a>
                  </div>
                </div>

                {/* Desktop Advisory Toast */}
                {desktopNotice && (
                  <div className="mt-4 p-3 bg-saffron/10 border border-saffron/30 rounded-xl text-left flex items-start gap-2">
                    <Info className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                    <div className="text-xs text-charcoal flex-1">
                      <p>{desktopNotice}</p>
                      <button
                        onClick={() => setDesktopNotice(null)}
                        className="mt-1.5 text-[11px] font-semibold text-forest underline block"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Where Your Support Goes */}
            <ScrollReveal delay={0.2} className="lg:col-span-1">
              <div>
                <h3
                  className="text-xl font-semibold text-forest mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Where Your Support Goes
                </h3>

                <div className="space-y-4">
                  {allocationItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-forest/5"
                    >
                      <div className={`w-10 h-10 rounded-xl ${item.color}/10 flex items-center justify-center`}>
                        <item.icon className="w-5 h-5 text-forest" />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-charcoal">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-charcoal-light">
                        {item.percentage}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-xs text-charcoal-light/60 italic">
                  Allocation percentages are configurable and will be updated with
                  verified foundation data.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Donation Modal */}
      <Modal
        open={showDonateForm}
        onClose={closeModal}
        title={
          step === "details"
            ? `Donate ₹${finalAmount.toLocaleString("en-IN")}`
            : step === "payment"
            ? "Complete Your Payment"
            : undefined
        }
      >
        {/* Step 1: Donor Details */}
        {step === "details" && (
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <p className="text-sm text-charcoal-light mb-4">
              Please provide your details, then scan the QR or use a UPI app to pay.
            </p>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Full Name <span className="text-terracotta">*</span>
              </label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Email Address <span className="text-terracotta">*</span>
              </label>
              <input
                type="email"
                required
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-forest/10 bg-offwhite text-charcoal focus:border-green focus:bg-white focus:outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>
            <div className="bg-cream rounded-xl p-4 text-center">
              <p className="text-sm text-charcoal-light">Amount</p>
              <p className="text-2xl font-bold text-forest" style={{ fontFamily: "var(--font-heading)" }}>
                ₹{finalAmount.toLocaleString("en-IN")}
              </p>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-saffron hover:bg-saffron-dark text-white font-bold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-saffron/25"
            >
              <Heart className="w-5 h-5" />
              Continue to Payment
            </button>
          </form>
        )}

        {/* Step 2: Payment (QR + UPI links) */}
        {step === "payment" && (
          <div className="space-y-5">
            <div className="bg-green/10 border border-green/20 rounded-xl px-4 py-3 text-center">
              <p className="text-sm font-semibold text-forest">
                Paying ₹{finalAmount.toLocaleString("en-IN")} to {DONATION_CONFIG.payeeName}
              </p>
            </div>

            {/* Synchronized Verified QR Code */}
            <div className="text-center">
              <p className="text-xs text-charcoal-light mb-3 font-medium uppercase tracking-wider">
                Scan with any UPI App
              </p>
              <div className="flex justify-center">
                <UpiQrCode
                  amount={finalAmount}
                  size={220}
                  showAmountBadge={true}
                  showDownload={true}
                />
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <p className="text-xs font-mono font-medium text-charcoal">{DONATION_CONFIG.upiId}</p>
                <button
                  onClick={copyUpiId}
                  className="text-green hover:text-forest transition-colors p-1"
                  title="Copy UPI ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              {copied && <p className="text-[11px] text-green mt-1 font-semibold">Copied!</p>}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-forest/10" />
              <span className="text-xs text-charcoal-light font-medium">
                OR open in app
              </span>
              <div className="flex-1 h-px bg-forest/10" />
            </div>

            {/* Universal & App-Specific UPI Buttons */}
            <div className="space-y-2">
              <a
                href={buildAppUpiUrl("universal", finalAmount)}
                onClick={(e) => handleAppClick(e, "UPI App")}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-forest text-white font-semibold text-sm hover:bg-forest/90 transition-all shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Pay via Any UPI App (Universal)
              </a>

              <div className="grid grid-cols-3 gap-3">
                <a
                  href={buildAppUpiUrl("gpay", finalAmount)}
                  onClick={(e) => handleAppClick(e, "Google Pay")}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border-2 border-forest/10 hover:border-green/40 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1A73E8]/10 flex items-center justify-center font-bold text-[#1A73E8] text-sm">
                    G
                  </div>
                  <span className="text-xs font-semibold text-charcoal group-hover:text-forest">
                    GPay
                  </span>
                </a>
                <a
                  href={buildAppUpiUrl("phonepe", finalAmount)}
                  onClick={(e) => handleAppClick(e, "PhonePe")}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border-2 border-forest/10 hover:border-green/40 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#5F259F]/10 flex items-center justify-center font-bold text-[#5F259F] text-sm">
                    P
                  </div>
                  <span className="text-xs font-semibold text-charcoal group-hover:text-forest">
                    PhonePe
                  </span>
                </a>
                <a
                  href={buildAppUpiUrl("paytm", finalAmount)}
                  onClick={(e) => handleAppClick(e, "Paytm")}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border-2 border-forest/10 hover:border-green/40 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#00BAF2]/10 flex items-center justify-center font-bold text-[#00BAF2] text-sm">
                    ₹
                  </div>
                  <span className="text-xs font-semibold text-charcoal group-hover:text-forest">
                    Paytm
                  </span>
                </a>
              </div>
            </div>

            {/* Desktop Notice within Modal */}
            {desktopNotice && (
              <div className="p-3 bg-saffron/10 border border-saffron/30 rounded-xl text-left flex items-start gap-2">
                <Info className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                <div className="text-xs text-charcoal flex-1">
                  <p>{desktopNotice}</p>
                  <button
                    onClick={() => setDesktopNotice(null)}
                    className="mt-1 text-[11px] font-semibold text-forest underline block"
                  >
                    Got it
                  </button>
                </div>
              </div>
            )}

            {/* Done Button */}
            <button
              onClick={handleDone}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-forest hover:bg-forest/90 text-white font-bold rounded-full transition-all duration-300 hover:shadow-xl mt-2"
            >
              <CheckCircle className="w-5 h-5" />
              I&apos;ve Sent the Payment via UPI
            </button>
            <p className="text-[11px] text-charcoal-light/70 text-center italic">
              Once you complete the payment in your UPI app, click above to submit your donation record for bank reconciliation.
            </p>
          </div>
        )}
      </Modal>

      {/* Payment Confirmation Popup (Accurate, Pending Verification) */}
      {showConfirmation && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.55)" }}
          onClick={closeConfirmation}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "confirmPop 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
            }}
          >
            {/* Auto-close progress bar */}
            <div
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-saffron to-green transition-all"
              style={{ width: `${confirmProgress}%` }}
            />

            {/* Close button */}
            <button
              onClick={closeConfirmation}
              className="absolute top-4 right-4 text-charcoal-light/50 hover:text-charcoal transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="px-8 pt-9 pb-8 text-center">
              {/* Animated checkmark icon */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "linear-gradient(135deg, #e76f51 0%, #2d6a4f 100%)",
                  boxShadow: "0 8px 28px rgba(45,106,79,0.25)",
                  animation: "checkBounce 0.6s 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
                }}
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </div>

              <h2
                className="text-2xl font-bold text-forest mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Thank You, {donorName}! 🙏
              </h2>

              {/* Status Chip */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-saffron/15 text-saffron-dark border border-saffron/30 mb-4">
                <Clock className="w-3.5 h-3.5" />
                Donation Request Recorded — Awaiting Bank Verification
              </div>

              <p className="text-charcoal-light text-sm mb-5 leading-relaxed">
                Your donation pledge of{" "}
                <span className="font-bold text-forest text-base">₹{finalAmount.toLocaleString("en-IN")}</span>{" "}
                has been recorded. Because UPI payments take place directly in your banking app, our team reconciles bank credits before issuing formal receipts.
              </p>

              <div className="bg-gradient-to-r from-saffron/10 via-green/10 to-saffron/10 rounded-2xl p-4 mb-5 border border-green/20 text-left">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-charcoal-light font-medium">Recipient</span>
                  <span className="font-semibold text-forest">{DONATION_CONFIG.payeeName}</span>
                </div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-charcoal-light font-medium">UPI VPA</span>
                  <span className="font-mono font-medium text-forest">{DONATION_CONFIG.upiId}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-charcoal-light font-medium">Donor Email</span>
                  <span className="font-medium text-forest truncate max-w-[200px]">{donorEmail}</span>
                </div>
              </div>

              <p className="text-xs text-charcoal-light/70 mb-5">
                A verification update will be sent to your email once our accounts team confirms the bank credit.
              </p>

              <button
                onClick={closeConfirmation}
                className="w-full px-8 py-3.5 bg-forest hover:bg-forest/90 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-forest/25"
              >
                Done
              </button>

              <p className="text-[10px] text-charcoal-light/50 mt-3">Closes automatically in a few seconds</p>
            </div>
          </div>

          <style>{`
            @keyframes confirmPop {
              from { opacity: 0; transform: scale(0.7) translateY(30px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes checkBounce {
              from { opacity: 0; transform: scale(0.3); }
              to   { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
