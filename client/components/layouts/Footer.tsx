"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react";
import { BukkaButton } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const [email, setEmail] = React.useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="bg-muted/30 border-t">
      <section className="container mx-auto px-4 py-16">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <section className="space-y-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-24 flex items-center hover:cursor-pointer"
            >
              <Image
                src="/images/bukka.png"
                alt="Logo"
                width={180}
                height={38}
                priority
                className="w-full h-full"
              />
            </motion.div>
            <p className="text-muted-foreground max-w-sm">
              Discover amazing restaurants and cuisines in your area. Join
              thousands of food lovers finding their next favorite meal.
            </p>
            <section className="flex space-x-3">
              <BukkaButton
                variant="ghost"
                size="icon"
                className="hover:text-primary"
              >
                <Instagram className="w-4 h-4" />
              </BukkaButton>
              <BukkaButton
                variant="ghost"
                size="icon"
                className="hover:text-primary"
              >
                <Twitter className="w-4 h-4" />
              </BukkaButton>
              <BukkaButton
                variant="ghost"
                size="icon"
                className="hover:text-primary"
              >
                <Facebook className="w-4 h-4" />
              </BukkaButton>
            </section>
          </section>

          {/* Quick Links */}
          <section className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/search"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Find Restaurants
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/add-restaurant"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Add Your Restaurant
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </section>

          {/* Support */}
          <section className="space-y-4">
            <h3 className="font-semibold text-lg">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </section>

          {/* Newsletter */}
          <section className="space-y-4">
            <h3 className="font-semibold text-lg">Stay Updated</h3>
            <p className="text-muted-foreground text-sm">
              Get the latest restaurant recommendations and food trends
              delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <BukkaButton
                type="submit"
                variant="hero"
                size="sm"
                className="w-full"
              >
                Subscribe
              </BukkaButton>
            </form>
          </section>
        </section>

        {/* Bottom Section */}
        <section className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © 2025 Bukka. All rights reserved.
          </p>
          <section className="flex items-center space-x-6 text-sm text-muted-foreground">
            <section className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>hello@bukka.app</span>
            </section>
            <section className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>+ (234) 703-552-7946</span>
            </section>
          </section>
        </section>
      </section>
    </footer>
  );
}
