"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BukkaWaitingList() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    cuisine: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) setSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-subtle overflow-hidden px-6 py-20 text-center">
      {/* Background decorative glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-3xl rounded-full animate-pulse-glow" />
      </div>

      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl space-y-6"
      >
        <h1 className="text-5xl font-bold leading-tight sm:text-6xl text-shine">
          Discover Nigeria’s Finest Meals <br /> with{" "}
          <span className="text-primary">Bukka</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          We’re redefining how Nigerians find, order, and enjoy local
          delicacies. Join our exclusive waiting list and be first to experience
          the future of food discovery.
        </p>

        {/* Waitlist form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center max-w-2xl mx-auto"
        >
          <Input
            name="name"
            placeholder="Your name"
            onChange={handleChange}
            required
            className="bg-card shadow-card"
          />
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            onChange={handleChange}
            required
            className="bg-card shadow-card"
          />
          <Button
            type="submit"
            disabled={isSubmitting || success}
            className="warm-gradient text-white font-semibold px-6 py-3 rounded-lg shadow-elegant hover-glow"
          >
            {success
              ? "You're on the list! 🎉"
              : isSubmitting
              ? "Joining..."
              : "Join the Waitlist"}
          </Button>
        </form>

        {/* Subtext */}
        <div className="flex justify-center gap-4 text-muted-foreground mt-6 text-sm">
          <div className="flex items-center gap-1">
            <MapPin size={16} /> Available soon in Abuja, Lagos & more
          </div>
          <div className="flex items-center gap-1">
            <Utensils size={16} /> Over 2,000+ food lovers waiting
          </div>
        </div>
      </motion.div>

      {/* Floating CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-20 text-center"
      >
        <h2 className="text-2xl font-semibold text-primary mb-2">
          Be the first to get access
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Early members get exclusive invites, rewards, and free deliveries at
          launch.
        </p>
      </motion.div>

      {/* Footer */}
      <footer className="mt-24 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Bukka. All rights reserved.
      </footer>
    </main>
  );
}
