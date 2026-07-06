"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X, Sun, Moon, Heart } from "@phosphor-icons/react";
import { Button } from "./ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const pathname = usePathname();

  // Handle system theme on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || "light";

    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Defer state update to avoid synchronous cascading render warning
    const timer = setTimeout(() => {
      setTheme(initialTheme);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Impact Report", href: "/impact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-8">
        {/* Logo and Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border shadow-inner transition-transform group-hover:scale-105 duration-300">
            <Image
              src="/sio.jpg"
              alt="Slum Impact Organization Logo"
              fill
              className="object-cover"
              sizes="48px"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Slum Impact
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-sio-blue dark:text-sio-teal leading-none">
              Organization
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-2 text-sm font-semibold transition-colors duration-200 hover:text-sio-blue dark:hover:text-sio-teal ${
                  isActive ? "text-sio-blue dark:text-sio-teal" : "text-muted-foreground"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-sio-blue dark:bg-sio-teal rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all duration-200 hover:bg-muted hover:text-sio-blue dark:hover:text-sio-teal"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={20} weight="bold" /> : <Sun size={20} weight="bold" />}
          </button>

          {/* Donate CTA */}
          <Button
            asChild
            className="rounded-full bg-sio-blue hover:bg-sio-blue/90 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 dark:bg-sio-teal dark:text-sio-navy dark:hover:bg-sio-teal/90 px-6 py-5 text-sm"
          >
            <Link href="/donate" className="flex items-center gap-2">
              <Heart size={16} weight="fill" />
              Donate Now
            </Link>
          </Button>
        </div>

        {/* Mobile Actions and Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          {/* Theme Toggle (Mobile) */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} weight="bold" /> : <Sun size={18} weight="bold" />}
          </button>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors duration-200 hover:bg-muted"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full border-b border-border bg-background px-6 py-6 md:hidden shadow-lg animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`py-2 text-base font-semibold transition-colors duration-200 ${
                    isActive
                      ? "text-sio-blue dark:text-sio-teal border-l-2 border-sio-blue dark:border-sio-teal pl-3"
                      : "text-muted-foreground pl-3"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="h-[1px] w-full bg-border my-2" />
            <Button
              asChild
              className="w-full rounded-full bg-sio-blue hover:bg-sio-blue/90 text-white font-semibold dark:bg-sio-teal dark:text-sio-navy dark:hover:bg-sio-teal/90 py-5 text-sm"
              onClick={() => setIsOpen(false)}
            >
              <Link href="/donate" className="flex items-center justify-center gap-2">
                <Heart size={16} weight="fill" />
                Donate Now
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
