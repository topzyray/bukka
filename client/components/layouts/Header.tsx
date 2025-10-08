"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Heart, User, Menu, X } from "lucide-react";
import { BukkaButton } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("sticky top-0 z-50 backdrop-blur", className)}
    >
      <section className="container mx-auto px-4">
        <section className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover-scale">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-18 h-14 flex items-center justify-center mx-auto hover:cursor-pointer"
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
                className="pl-10 pr-4 py-2 w-full  border-white/20 focus:border-primary/50"
              />
            </section>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <BukkaButton variant="ghost" size="sm" asChild>
              <Link href="/search" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Explore
              </Link>
            </BukkaButton>
            <BukkaButton variant="ghost" size="sm" asChild>
              <Link href="/favorites" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favorites
              </Link>
            </BukkaButton>
            <BukkaButton variant="ghost" size="sm" asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </Link>
            </BukkaButton>
            <BukkaButton variant="hero" size="sm" asChild>
              <Link href="/signin">Sign In</Link>
            </BukkaButton>
          </nav>

          {/* Mobile Menu Button */}
          <BukkaButton
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </BukkaButton>
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
            <BukkaButton
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/search" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Explore
              </Link>
            </BukkaButton>
            <BukkaButton
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/favorites" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favorites
              </Link>
            </BukkaButton>
            <BukkaButton
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </Link>
            </BukkaButton>
            <section className="pt-2">
              <BukkaButton variant="hero" size="sm" className="w-full" asChild>
                <Link href="/signin">Sign In</Link>
              </BukkaButton>
            </section>
          </section>
        </motion.nav>
      </section>
    </motion.header>
  );
}
