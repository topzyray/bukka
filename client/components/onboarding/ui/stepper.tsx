"use client";

import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface StepperProps {
  steps: { title: string; description?: string }[] | string[];
  currentStep: number;
  onStepClick?: (index: number) => void;
  /**
   * If true, previous steps are clickable.
   * Defaults to false.
   */
  clickable?: boolean;
  /**
   * If true, shows a connecting progress bar with animation.
   * Defaults to true.
   */
  animatedBar?: boolean;
  /**
   * Optional className override for layout flexibility.
   */
  className?: string;
}

/**
 * A hybrid stepper component that merges the best of two worlds:
 * - Click navigation
 * - Visual progress bar, animations, and responsiveness
 */
export function Stepper({
  steps,
  currentStep,
  onStepClick,
  clickable = true,
  animatedBar = true,
  className,
}: StepperProps) {
  const parsedSteps = Array.isArray(steps)
    ? steps.map((s) => (typeof s === "string" ? { title: s } : s))
    : [];

  return (
    <nav
      aria-label="Onboarding Progress"
      className={clsx(
        "w-full flex flex-col items-center md:items-stretch",
        className
      )}
    >
      <ol className="relative flex flex-wrap items-center justify-center md:justify-between gap-4 w-full max-w-3xl">
        {parsedSteps.map((step, index) => {
          const state =
            index < currentStep
              ? "done"
              : index === currentStep
              ? "current"
              : "upcoming";

          return (
            <li
              key={step.title}
              className={clsx(
                "relative flex flex-col items-center md:items-start flex-1 min-w-[80px] group",
                index < parsedSteps.length - 1 && "md:flex-1"
              )}
            >
              {/* --- Connector Line --- */}
              {index < parsedSteps.length - 1 && (
                <div className="absolute hidden md:block top-4 left-[50%] w-full h-[2px] -translate-x-1/2 bg-muted-foreground/20">
                  {animatedBar && (
                    <motion.div
                      className="h-full bg-primary origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX:
                          currentStep > index
                            ? 1
                            : currentStep === index
                            ? 0.5
                            : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </div>
              )}

              {/* --- Step Circle --- */}
              <button
                type="button"
                onClick={() =>
                  clickable && index < currentStep && onStepClick?.(index)
                }
                disabled={!clickable || index >= currentStep}
                className={clsx(
                  "relative z-10 flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium transition-all shadow-sm",
                  state === "done" &&
                    "bg-primary text-primary-foreground hover:opacity-90",
                  state === "current" &&
                    "ring-2 ring-primary bg-background text-primary",
                  state === "upcoming" &&
                    "bg-muted/30 text-muted-foreground cursor-default"
                )}
              >
                {index + 1}
              </button>

              {/* --- Label + Description --- */}
              <div className="mt-2 text-center md:text-left">
                <span
                  className={clsx(
                    "block text-sm leading-tight",
                    state === "current"
                      ? "font-semibold text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
                {step.description && (
                  <span className="text-xs text-muted-foreground/70 hidden md:inline">
                    {step.description}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
