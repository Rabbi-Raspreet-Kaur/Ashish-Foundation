import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import LayoutShell from "@/components/LayoutShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://ashishfoundation.org"),
  title: {
    default: "Ashish Foundation — Creating Opportunities. Changing Lives.",
    template: "%s | Ashish Foundation",
  },
  description:
    "Ashish Foundation is a social organization based in Ayodhya, Uttar Pradesh working towards education, empowerment, inclusion and dignity for all. Support our mission today.",
  keywords: [
    "Ashish Foundation",
    "Ashish Foundation Ayodhya",
    "NGO in Ayodhya",
    "NGO in Uttar Pradesh",
    "education NGO Ayodhya",
    "child education NGO",
    "women empowerment NGO",
    "community development NGO",
    "disability support NGO",
    "social welfare organization Ayodhya",
  ],
  authors: [{ name: "Ashish Foundation" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Ashish Foundation",
    title: "Ashish Foundation — Creating Opportunities. Changing Lives.",
    description:
      "A social organization in Ayodhya working towards education, empowerment, inclusion and dignity.",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Ashish Foundation — Community education and empowerment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashish Foundation — Creating Opportunities. Changing Lives.",
    description:
      "A social organization in Ayodhya working towards education, empowerment, inclusion and dignity.",
    images: ["/images/hero-bg.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "Ashish Foundation",
  description:
    "A social organization based in Ayodhya, Uttar Pradesh working towards education, empowerment, inclusion and dignity.",
  url: "https://ashishfoundation.org",
  logo: "https://ashishfoundation.org/images/logo.png",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ayodhya",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
  sameAs: [],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-offwhite text-charcoal">
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}
