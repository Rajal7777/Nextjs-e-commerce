"use client";

import Link from "next/link";
import { useState } from "react";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowUp,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

// Simple brand SVG icons (lucide-react no longer ships brand logos)
const GithubIcon = ({ className }: { className?: string; }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string; }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0Z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) {
      // Add your newsletter API action here
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full border-t bg-card text-card-foreground">
      {/* Back to top banner */}
      <button
        onClick={scrollToTop}
        className="flex w-full items-center justify-center gap-2 bg-muted/60 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <span>Back to top</span>
        <ArrowUp className="h-3.5 w-3.5" />
      </button>

      {/* Feature Highlights */}
      <div className="border-b bg-background/50 py-6">
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 sm:grid-cols-3 md:px-6">
          <div className="flex items-center justify-center gap-3 text-center sm:justify-start sm:text-left">
            <Truck className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-semibold">Free Delivery</p>
              <p className="text-xs text-muted-foreground">
                On orders over ¥5,000
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 text-center sm:justify-start sm:text-left">
            <RotateCcw className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-semibold">30 Days Return</p>
              <p className="text-xs text-muted-foreground">
                Money back guarantee
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 text-center sm:justify-start sm:text-left">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-semibold">Secure Payment</p>
              <p className="text-xs text-muted-foreground">
                100% secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="container mx-auto px-4 py-10 md:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-5">
          {/* Brand & Newsletter Column */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="text-lg font-bold tracking-tight">
              {APP_NAME}
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground">
              Discover quality products, exclusive discounts, and fast delivery
              all in one place.
            </p>

            <div className="pt-2">
              <p className="text-sm font-semibold mb-2">
                Subscribe to our newsletter
              </p>
              {subscribed ? (
                <p className="text-sm text-green-600 font-medium">
                  Thanks for subscribing! Check your inbox soon.
                </p>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex max-w-sm items-center gap-2"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                  <Button type="submit" size="sm">
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </div>


          {/* Navigation Column 1 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/search"
                  className="hover:text-foreground transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/search?sort=rating"
                  className="hover:text-foreground transition-colors"
                >
                  Top Rated
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/user/orders"
                  className="hover:text-foreground transition-colors"
                >
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="hover:text-foreground transition-colors"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                FAQs & Help
              </li>
            </ul>
          </div>

          {/* Navigation Column 3 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li
                className="hover:text-foreground transition-colors">
                Privacy Policy
              </li>
              <li
                className="hover:text-foreground transition-colors">
                Terms of Service
              </li>
              <li
                className="hover:text-foreground transition-colors">
                Shipping Policy
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright, Socials, Payments */}
      <div className="border-t bg-muted/30 py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center text-xs text-muted-foreground md:flex-row md:px-6 md:text-left">
          <p>
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/Rajal7777"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-foreground transition-colors"
            >
              <GithubIcon className="h-4 w-4" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/rajal-suwal-158986165/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-foreground transition-colors"
            >
              <LinkedinIcon className="h-4 w-4" />
            </Link>
          </div>

          {/* Payment Options */}
          <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
            <span className="rounded border bg-background px-2 py-1">VISA</span>
            <span className="rounded border bg-background px-2 py-1">
              MASTERCARD
            </span>
            <span className="rounded border bg-background px-2 py-1">
              STRIPE
            </span>
            <span className="rounded border bg-background px-2 py-1">
              PAYPAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
