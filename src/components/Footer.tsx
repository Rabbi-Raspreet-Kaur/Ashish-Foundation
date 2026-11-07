import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  Camera,
  MessageCircle,
  Video,
  Briefcase,
  Heart,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { SITE } from "@/lib/constants";

const footerLinks = [
  {
    title: "Organization",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Work", href: "/#our-work" },
      { label: "Impact", href: "/#impact" },
      { label: "Stories", href: "/#stories" },
      { label: "Transparency", href: "/transparency" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Donate", href: "/#donate" },
      { label: "Volunteer", href: "/#help" },
      { label: "Partner With Us", href: "/#help" },
      { label: "Events", href: "/#events" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Gallery", href: "/gallery" },
      { label: "Annual Reports", href: "/transparency" },
      { label: "Member Login", href: "/login" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Use", href: "#" },
    ],
  },
];

const socialIcons = [
  { icon: Globe, href: SITE.social.facebook, label: "Facebook" },
  { icon: Camera, href: SITE.social.instagram, label: "Instagram" },
  { icon: MessageCircle, href: SITE.social.twitter, label: "Twitter" },
  { icon: Video, href: SITE.social.youtube, label: "YouTube" },
  { icon: Briefcase, href: SITE.social.linkedin, label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-forest text-white" role="contentinfo">
      {/* Main Footer */}
      <div className="container-wide mx-auto section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/10">
                <Image
                  src="/images/logo.png"
                  alt="Ashish Foundation Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <span
                  className="text-xl font-semibold tracking-tight text-white block"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Ashish Foundation
                </span>
                <span className="text-xs text-white/60 tracking-widest uppercase">
                  Ayodhya, India
                </span>
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
              {SITE.tagline}
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-sm">
              Working towards a more educated, empowered and inclusive society
              where every individual can live with dignity.
            </p>

            {/* Contact info */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <MapPin className="w-4 h-4 text-saffron flex-shrink-0" />
                <span>{SITE.address}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Mail className="w-4 h-4 text-saffron flex-shrink-0" />
                <span>{SITE.email}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Phone className="w-4 h-4 text-saffron flex-shrink-0" />
                <span>{SITE.phone}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socialIcons.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-saffron hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-6">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-saffron transition-colors duration-300 flex items-center gap-1.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-wide mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50 text-center md:text-left">
            © {new Date().getFullYear()} Ashish Foundation. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-white/50">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-terracotta fill-terracotta" />
            <span>for the community</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
