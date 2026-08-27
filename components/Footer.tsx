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
  Globe,
  Share2,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

const handleSubscribe = (e: React.FormEvent<HTMLFormElement>)  => {
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
              href="https://facebook.com"
              target="_blank"
              aria-label="Facebook"
              className="hover:text-foreground"
            >
              <Share2 className="h-4 w-4" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              aria-label="Instagram"
              className="hover:text-foreground"
            >
              <Globe className="h-4 w-4" />
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
