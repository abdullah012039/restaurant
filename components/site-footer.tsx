"use client";

import Link from "next/link";
import { useApp } from "@/contexts/app-context";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MessageCircle,
} from "lucide-react"; // Assuming TikTok icon isn't in Lucide, using MessageCircle as placeholder

const socialIcons = {
  facebook: <Facebook className="h-5 w-5" />,
  instagram: <Instagram className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  youtube: <Youtube className="h-5 w-5" />,
  tiktok: <MessageCircle className="h-5 w-5" />, // Placeholder for TikTok
};

export default function SiteFooter() {
  const { state } = useApp();
  const { publicData } = state;
  const currentYear = new Date().getFullYear();

  if (!publicData || !publicData.system) {
    return null;
  }

  const { system } = publicData;

  return (
    <footer className="bg-muted/50 border-t border-border/40 text-muted-primary ">
      <div className="bg-primary text-primary-foreground">
        <div className="container xl:container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 ">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {system.public_title}
              </h3>
              <p className="text-sm leading-relaxed">
                {system.public_description.substring(0, 150)}...
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-primary transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="hover:text-primary transition-colors"
                  >
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-primary transition-colors"
                  >
                    FAQ
                  </Link>
                </li>{" "}
                {/* Placeholder */}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Contact
              </h3>
              <ul className="space-y-2 text-sm">
                {system.whatsapp_number && (
                  <li>
                    WhatsApp:{" "}
                    <a
                      href={`https://wa.me/${system.whatsapp_number.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {system.whatsapp_number}
                    </a>
                  </li>
                )}
                {/* Add email if available */}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Follow Us
              </h3>
              <div className="flex space-x-3">
                {Object.entries(system.social_links || {}).map(
                  ([platform, url]) =>
                    url && (
                      <a
                        key={platform}
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={platform}
                        className="hover:text-primary transition-colors"
                      >
                        {socialIcons[platform as keyof typeof socialIcons] || (
                          <MessageCircle className="h-5 w-5" />
                        )}
                      </a>
                    )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-foreground border-border/40">
      <div className="container py-6">
        <div className="border-border/60 text-center text-sm text-secondary">
          <p>
            &copy; {currentYear} {system.public_title}. All rights reserved.
          </p>
          <p className="mt-1">
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>{" "}
            |{" "}
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
      </div>
    </footer>
  );
}

SiteFooter.defaultProps = {}; // Required for Next.js
