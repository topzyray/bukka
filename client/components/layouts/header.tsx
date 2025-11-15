"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Menu,
  X,
  LayoutDashboard,
  FormInputIcon,
  FormInput,
  BriefcaseBusiness,
} from "lucide-react";
import { BukkaButton } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../ui/mode-toggle";
import { useAuth } from "@/providers/auth-provider";
import { RouteHelper } from "@/helpers";
import { User } from "@/data/interfaces/User";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const { user } = useAuth();
  const route = RouteHelper.getDashboardPath(user as User);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(
        `/businesses?search=${encodeURIComponent(searchValue.trim())}`
      );
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("sticky top-0 backdrop-blur z-50", className)}
    >
      <section className="lg:container mx-auto px-4">
        <section className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover-scale">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-18 h-14 flex items-center justify-center mx-auto hover:cursor-pointer dark:bg-white/80 dark:p-0.5 dark:rounded dark:backdrop-blur"
              // onClick={() => router.push("/")}
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
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-md mx-8"
          >
            <section className="relative w-full glass rounded-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search restaurants, cuisines..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 pr-4 py-2 w-full  border-white/20 dark:bg-transparent focus:border-primary/50 dark:text-primary dark:placeholder:text-primary"
              />
            </section>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <BukkaButton variant="ghost" size="sm" asChild>
              <Link href="/businesses" className="flex items-center gap-2">
                <BriefcaseBusiness className="w-4 h-4" />
                Businesses
              </Link>
            </BukkaButton>
            <BukkaButton variant="ghost" size="sm" asChild>
              <Link href="/explore" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Explore
              </Link>
            </BukkaButton>
            <BukkaButton variant="ghost" size="sm" asChild>
              <Link href="/maps" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Map View
              </Link>
            </BukkaButton>
            <BukkaButton
              variant="hero"
              size="sm"
              asChild
              onClick={() => router.push(route)}
            >
              <FormInput />
              {user?.role ? "Dashboard" : "Sign In"}
            </BukkaButton>
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <section className="space-x-2 md:hidden">
            <ThemeToggle />
            <BukkaButton
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </BukkaButton>
          </section>
        </section>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <section className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search restaurants..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 pr-4 py-2 w-full glass border-white/20"
            />
          </section>
        </form>

        {/* Mobile Navigation */}
        <motion.nav
          initial={false}
          animate={{
            height: isMenuOpen ? "auto" : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden"
        >
          <section className="py-4 space-y-2">
            <BukkaButton variant="ghost" className="w-full" asChild>
              <Link href="/businesses" className="flex items-center gap-2">
                <BriefcaseBusiness className="w-4 h-4" />
                Businesses
              </Link>
            </BukkaButton>
            <BukkaButton variant="ghost" className="w-full" asChild>
              <Link href="/explore" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Explore
              </Link>
            </BukkaButton>
            <BukkaButton variant="ghost" asChild className="w-full ">
              <Link href="/maps" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Map View
              </Link>
            </BukkaButton>
            <section className="pt-2">
              <BukkaButton
                variant="hero"
                className="w-full"
                asChild
                onClick={() => router.push(route)}
              >
                <span className="flex gap-2">
                  {user ? <LayoutDashboard /> : <FormInputIcon />}
                  {user?.role ? "Dashboard" : "Sign In"}
                </span>
              </BukkaButton>
            </section>
          </section>
        </motion.nav>
      </section>
    </motion.header>
  );
}
