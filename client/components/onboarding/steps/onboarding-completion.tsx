"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import { Loader2, Zap, Utensils, Heart, CheckCircle } from "lucide-react";
import { useAuth } from "@/providers";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

export default function OnboardingCompleteScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);

  const { mutate, isPending, isError, isSuccess, error } = useMutation({
    mutationFn: async (userId: string) => {
      // Replace with your real API call
      // await axios.post("/api/v1/profile/complete", { userId });
      return new Promise((resolve) => setTimeout(resolve, 1500));
    },
    onSuccess: () => {
      setIsCompleted(true);
    },
    onError: (err) => {
      console.error("Profile completion error:", err);
    },
  });

  const handleCompleteProfile = () => {
    if (user?.id) mutate(user.id);
  };

  const displayName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  const userRole = user?.role ?? "Creator";

  // 🎉 Auto-redirect after completion
  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => router.push("/dashboard"), 2500);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, router]);

  // 🌈 Dynamic button label
  const renderButtonContent = () => {
    if (isPending) {
      return (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Finalizing Setup...
        </>
      );
    }
    if (isSuccess || isCompleted) {
      return (
        <>
          <CheckCircle className="mr-2 h-5 w-5" />
          Profile Live! Redirecting...
        </>
      );
    }
    return "Complete Onboarding & Launch Profile";
  };

  // 💡 Value Proposition Cards
  const valueCards = [
    {
      icon: Utensils,
      title: "Local Discovery",
      description:
        "Get discovered by thousands searching for eateries, bars, and small shops right now.",
      color: "text-accent",
    },
    {
      icon: Zap,
      title: "Real-Time Connection",
      description:
        "Instantly connect with dispatch riders, investors, and fellow entrepreneurs in your area.",
      color: "text-primary-glow",
    },
    {
      icon: Heart,
      title: "Community Focus",
      description:
        "Join the movement redefining local commerce and supporting the vibrant 'Bukka' economy.",
      color: "text-secondary",
    },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-background overflow-hidden">
      {/* 🎊 Confetti Celebration */}
      <AnimatePresence>
        {isCompleted && <Confetti recycle={false} numberOfPieces={250} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "w-full max-w-4xl p-6 md:p-10 rounded-[var(--radius-xl)] shadow-card bg-card border border-border transition-all duration-700",
          isCompleted && "ring-4 ring-accent/40 scale-[1.01]"
        )}
      >
        {/* 🧭 Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120, delay: 0.3 }}
          >
            <CheckCircle className="w-16 h-16 text-primary mb-4 mx-auto animate-[pulse-glow_2s_ease-in-out_infinite]" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">
            You&apos;re All Set,{" "}
            <span className="text-shine">{displayName || "Bukka Star"}</span>!
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            Ready to launch your journey as a{" "}
            <span className="text-primary font-semibold">{userRole}</span>.
          </p>

          <p className="text-muted-foreground max-w-3xl mx-auto mt-4">
            Bukka connects you to the entire local commerce ecosystem. Here’s
            what you’re launching:
          </p>
        </div>

        {/* 🌍 Value Proposition Cards */}
        <motion.div
          layout
          className="grid md:grid-cols-3 gap-6 mb-10"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
        >
          {valueCards.map((card, index) => (
            <motion.div
              key={card.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="p-6 bg-muted/30 rounded-[var(--radius-lg)] border border-border shadow-md hover-lift hover-glow transition-all duration-300"
            >
              <card.icon className={`w-8 h-8 ${card.color} mb-3`} />
              <h3 className="text-lg font-bold text-foreground mb-1">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* 🚀 Action Button */}
        <div className="text-center">
          <motion.button
            layout
            onClick={handleCompleteProfile}
            disabled={isPending || isSuccess}
            whileHover={!isPending && !isSuccess ? { scale: 1.05 } : {}}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative inline-flex items-center justify-center w-full md:w-3/4 lg:w-1/2 px-10 py-4 text-xl font-extrabold rounded-[var(--radius-lg)] text-primary-foreground shadow-elegant transition-all duration-300 overflow-hidden",
              isSuccess
                ? "bg-secondary/90 cursor-default"
                : isPending
                ? "bg-primary/50 cursor-not-allowed"
                : "bg-gradient-primary hover-glow"
            )}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isPending ? "pending" : isSuccess ? "success" : "default"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center"
              >
                {renderButtonContent()}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* ✅ Status Feedback */}
          {(isError || isSuccess) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={cn(
                "mt-6 p-3 rounded-md border animate-[fade-in_0.5s_ease-out]",
                isError
                  ? "bg-destructive/10 text-destructive border-destructive"
                  : "bg-secondary/10 text-secondary border-secondary"
              )}
            >
              {isError ? (
                <p className="text-sm font-semibold">
                  <span className="font-bold">Oh no!</span> We hit an error:{" "}
                  {error?.message || "Could not finalize profile."}
                </p>
              ) : (
                <p className="text-sm font-semibold">
                  Success! Your Bukka profile is now live. Welcome to the
                  community!
                </p>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
