"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
  YoutubeLogo,
  Envelope,
  Phone,
  MapPin,
  PaperPlaneRight,
} from "@phosphor-icons/react";
import { Button } from "./ui/button";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="w-full bg-[#001F56] text-white transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Logo & Description */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/20">
                <Image
                  src="/sio.jpg"
                  alt="Slum Impact Organization Logo"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-sans text-lg font-bold tracking-tight">Slum Impact</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-sio-teal leading-none">
                  Organization
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-300 max-w-sm">
              Empowering children living in slums through quality education, health nutrition, and
              talent development. Providing a pathway to a brighter future.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-sio-teal hover:text-sio-navy transition-all duration-300"
                aria-label="Facebook"
              >
                <FacebookLogo size={20} weight="fill" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-sio-teal hover:text-sio-navy transition-all duration-300"
                aria-label="Instagram"
              >
                <InstagramLogo size={20} weight="fill" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-sio-teal hover:text-sio-navy transition-all duration-300"
                aria-label="Twitter"
              >
                <TwitterLogo size={20} weight="fill" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-sio-teal hover:text-sio-navy transition-all duration-300"
                aria-label="YouTube"
              >
                <YoutubeLogo size={20} weight="fill" />
              </a>
            </div>
          </div>

          {/* Quick Links & Contact */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-1">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-sio-teal">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/impact" className="hover:text-white transition-colors">
                    Impact Report
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-sio-teal">
                Contact Us
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <MapPin size={18} className="text-sio-teal shrink-0 mt-0.5" />
                  <span>Somewhere on Earth Address</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={18} className="text-sio-teal shrink-0" />
                  <span>+1234567890</span>
                </li>
                <li className="flex items-center gap-2">
                  <Envelope size={18} className="text-sio-teal shrink-0" />
                  <span>info@slumimpact.org</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-sio-teal">
              Support Our Cause
            </h3>
            <p className="text-sm text-slate-300">
              Subscribe to receive updates on our programs, impact stories, and upcoming events.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Enter email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder-slate-400 focus:border-sio-teal focus:outline-none focus:ring-1 focus:ring-sio-teal"
              />
              <Button
                type="submit"
                className="bg-sio-teal text-sio-navy hover:bg-sio-teal/95 font-semibold px-4 py-2 flex items-center justify-center gap-2 shrink-0 transition-colors"
              >
                <span>Subscribe</span>
                <PaperPlaneRight size={14} weight="fill" />
              </Button>
            </form>
            {subscribed && (
              <span className="text-xs text-sio-teal animate-fade-in">
                Thank you for subscribing!
              </span>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-8 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Slum Impact Organization (SIO). All rights reserved.</p>
          <p className="mt-1 text-slate-500">
            Registered Non-Governmental Organization (NGO) catering to slum youth and community
            transformation.
          </p>
        </div>
      </div>
    </footer>
  );
}
