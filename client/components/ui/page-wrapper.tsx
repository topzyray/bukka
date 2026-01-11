"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

function PageWrapper({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("min-h-screen bg-background", className)}
      {...props}
    />
  );
}

function PageWrapperHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return <header className={cn(className)} {...props} />;
}

function PageWrapperContent({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main className={cn("container mx-auto px-4 py-4", className)} {...props} />
  );
}

function PageWrapperContentWithFramer({
  className,
  ...props
}: HTMLMotionProps<"section">) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("space-y-4 lg:space-y-6", className)}
      {...props}
    />
  );
}

function PageWrapperFooter({
  className,
  ...props
}: React.ComponentProps<"footer">) {
  return <footer className={cn(className)} {...props} />;
}

export {
  PageWrapper,
  PageWrapperHeader,
  PageWrapperContent,
  PageWrapperContentWithFramer,
  PageWrapperFooter,
};
