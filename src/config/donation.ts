/**
 * Ashish Foundation - Central Donation & UPI Configuration
 * Single Source of Truth for all UPI payments and donation parameters.
 *
 * RECIPIENT ADVISORY:
 * The repository originally had two conflicting identifiers:
 * 1. "8299052548m@pnb" (configured in donation interface & deep links)
 * 2. "ashishfoundation@upi" (labeled on old un-scannable mock image)
 *
 * To avoid misrouting donations, configure the verified UPI ID in your environment:
 *   NEXT_PUBLIC_UPI_ID="your_verified_upi_id@bank"
 *   NEXT_PUBLIC_UPI_NAME="Ashish Foundation"
 *   NEXT_PUBLIC_UPI_VERIFIED="true"
 *
 * If not set in the environment, the system defaults to "8299052548m@pnb".
 */

export interface DonationConfig {
  upiId: string;
  payeeName: string;
  currency: string;
  defaultNote: string;
  isVerified: boolean;
  conflictingUpiId: string;
}

export const DONATION_CONFIG: DonationConfig = {
  upiId: process.env.NEXT_PUBLIC_UPI_ID || "8299052548m@pnb",
  payeeName: process.env.NEXT_PUBLIC_UPI_NAME || "Ashish Foundation",
  currency: "INR",
  defaultNote: "Donation to Ashish Foundation",
  isVerified: process.env.NEXT_PUBLIC_UPI_VERIFIED === "true",
  conflictingUpiId: "ashishfoundation@upi",
};

/**
 * Builds a valid, standard UPI payment URI.
 * Format: upi://pay?pa=VERIFIED_UPI_ID&pn=Ashish%20Foundation&cu=INR[&am=...][&tn=...]
 *
 * @param amount Optional positive donation amount in INR
 * @param customNote Optional transaction note
 * @returns RFC-compliant standard upi://pay URI
 */
export function buildStandardUpiUri(amount?: number | null, customNote?: string): string {
  const upiId = DONATION_CONFIG.upiId.trim();
  const payeeName = DONATION_CONFIG.payeeName.trim();
  const currency = DONATION_CONFIG.currency;
  const note = (customNote || DONATION_CONFIG.defaultNote).trim();

  // Construct URI query parameters with standard encoding
  // Using %20 for spaces ensures strict compatibility across all UPI apps
  const parts: string[] = [
    `pa=${encodeURIComponent(upiId)}`,
    `pn=${encodeURIComponent(payeeName).replace(/%20/g, "%20")}`,
    `cu=${currency}`,
  ];

  // Only include amount if it is a valid, positive, finite number
  if (typeof amount === "number" && !isNaN(amount) && isFinite(amount) && amount > 0) {
    const formattedAmount = amount % 1 === 0 ? amount.toString() : amount.toFixed(2);
    parts.push(`am=${formattedAmount}`);
  }

  if (note) {
    parts.push(`tn=${encodeURIComponent(note).replace(/%20/g, "%20")}`);
  }

  return `upi://pay?${parts.join("&")}`;
}

/**
 * Generates app-specific intent URLs or universal standard UPI fallback.
 */
export function buildAppUpiUrl(
  app: "universal" | "gpay" | "phonepe" | "paytm",
  amount?: number | null,
  customNote?: string
): string {
  const standardUri = buildStandardUpiUri(amount, customNote);
  const query = standardUri.replace("upi://pay?", "");

  switch (app) {
    case "gpay":
      return `gpay://upi/pay?${query}`;
    case "phonepe":
      return `phonepe://pay?${query}`;
    case "paytm":
      return `paytmmp://pay?${query}`;
    case "universal":
    default:
      return standardUri;
  }
}
