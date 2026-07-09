"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Coins,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  CaretDown,
  Heart,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { z } from "zod";

// Zod validation schema for donations
const donateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(16, "Phone number cannot exceed 16 digits")
    .regex(/^[+]?[0-9\s-]+$/, "Invalid characters. Use numbers, spaces, and hyphens"),
  amount: z
    .number({ message: "Please enter a valid number" })
    .min(500, "Minimum donation amount is ₦500"),
  interval: z.string().min(1),
  preference: z.string().min(1),
});

// Custom animated dropdown select component
interface SelectOption {
  value: string;
  label: string;
}

function CustomSelect({
  id,
  value,
  onChange,
  options,
  label,
  error,
}: {
  id: string;
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  label: string;
  error?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label
        htmlFor={id}
        className={`text-xs font-bold uppercase tracking-wider transition-colors ${
          error ? "text-destructive" : "text-foreground"
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 cursor-pointer transition-all ${
            isOpen
              ? "border-sio-blue ring-1 ring-sio-blue dark:border-sio-teal dark:ring-sio-teal"
              : error
                ? "border-destructive focus:border-destructive focus:ring-destructive"
                : "border-border hover:border-sio-blue/30 dark:hover:border-sio-teal/30"
          }`}
        >
          <span>{selectedOption.label}</span>
          <CaretDown
            size={16}
            className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              role="listbox"
              className="absolute left-0 right-0 z-30 mt-1.5 max-h-60 w-full overflow-auto rounded-xl border border-border bg-card/95 backdrop-blur-md py-1.5 shadow-xl outline-none"
            >
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer select-none transition-colors ${
                      isSelected
                        ? "bg-sio-blue/10 dark:bg-sio-teal/10 text-sio-blue dark:text-sio-teal font-bold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <CheckCircle
                        size={16}
                        weight="fill"
                        className="text-sio-blue dark:text-sio-teal"
                      />
                    )}
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      {error && <p className="text-xs text-destructive mt-1 font-semibold">{error}</p>}
    </div>
  );
}

export default function Donate() {
  const [amountPreset, setAmountPreset] = useState<number | "custom">(15000);
  const [customAmountText, setCustomAmountText] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interval: "monthly",
    preference: "general",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form | "amount", string>>>({});
  const [submitted, setSubmitted] = useState(false);

  // Clear specific field errors when user starts typing/correcting
  const handleFieldChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleAmountChange = (val: number | "custom") => {
    setAmountPreset(val);
    if (errors.amount) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.amount;
        return next;
      });
    }
  };

  const handleCustomTextChange = (val: string) => {
    setCustomAmountText(val);
    if (errors.amount) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.amount;
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse the final donation amount
    const parsedAmount =
      amountPreset === "custom" ? parseFloat(customAmountText) || 0 : amountPreset;

    const validationPayload = {
      ...form,
      amount: parsedAmount,
    };

    const result = donateSchema.safeParse(validationPayload);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof typeof form | "amount", string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof typeof form | "amount";
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
      setSubmitted(true);
    }
  };

  const selectedAmountLabel =
    amountPreset === "custom"
      ? `₦${parseFloat(customAmountText).toLocaleString() || "0"}`
      : `₦${amountPreset.toLocaleString()}`;

  return (
    <div className="flex flex-col w-full overflow-x-hidden bg-background">
      {/* 1. HERO HEADER */}
      <section className="relative py-20 px-6 lg:px-8 border-b border-border bg-gradient-to-br from-background via-background to-sio-blue/5 text-center">
        <div className="mx-auto max-w-4xl">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sio-blue dark:text-sio-teal bg-sio-blue/10 dark:bg-sio-teal/10 px-3 py-1.5 rounded-full mb-6"
          >
            <Heart size={12} weight="fill" />
            Partner with Slum Impact Organization
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Empower Slum Communities
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Your financial support helps SIO provide tuition, feeding programs, and secure wellness
            hubs for children in high-need districts.
          </motion.p>
        </div>
      </section>

      {/* 2. DUAL COLUMN FORM & CONTENT */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Side Visual Card (Left) */}
          <div className="lg:col-span-5 relative flex flex-col justify-between bg-sio-navy text-white rounded-3xl p-8 sm:p-10 border border-sio-teal/20 shadow-xl overflow-hidden min-h-[400px]">
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/donate_hero.jpg"
                alt="Smiling children learning in a sunlit classroom"
                fill
                className="object-cover opacity-25"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-sio-teal bg-white/10 px-3 py-1 rounded-full">
                Your Donation Matters
              </span>
              <h3 className="text-3xl font-serif font-bold text-white mt-6 mb-4 leading-tight">
                Fuel Long-Term Impact
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                100% of public donations go directly into funding program resources on the ground.
                By supporting SIO, you ensure local children have a direct developmental safety net.
              </p>
            </div>

            {/* Micro-transparency stats */}
            <div className="relative z-10 border-t border-white/15 pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-white/10 text-sio-teal flex items-center justify-center">
                  <ShieldCheck size={20} weight="fill" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold uppercase text-white">
                    100% Secure Transaction
                  </h4>
                  <p className="text-[11px] text-slate-400">Encrypted merchant gateways</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-white/10 text-sio-teal flex items-center justify-center">
                  <Coins size={20} weight="fill" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold uppercase text-white">
                    Audited Financial Stewardship
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Annual audit reports published openly
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Panel (Right) */}
          <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-md">
            {!submitted ? (
              <form onSubmit={handleSubmit} noValidate className="space-y-8 text-left">
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-foreground">
                    Select Donation Amount
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose one of our preset support blocks or enter a custom amount (Naira ₦).
                  </p>
                </div>

                {/* Preset Amount Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      val: 5000,
                      label: "₦5,000",
                      desc: "Provides books, pens, and school bags for one child.",
                    },
                    {
                      val: 15000,
                      label: "₦15,000",
                      desc: "Feeds two children hot lunch meals daily for a month.",
                    },
                    {
                      val: 50000,
                      label: "₦50,000",
                      desc: "Covers tuition, uniforms, and shoes for a child for a full year.",
                    },
                    {
                      val: 100000,
                      label: "₦100,000",
                      desc: "Supports clean water and health check supplies at our hub.",
                    },
                  ].map((preset) => {
                    const isSelected = amountPreset === preset.val;
                    return (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => handleAmountChange(preset.val)}
                        className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-32 cursor-pointer ${
                          isSelected
                            ? "border-sio-blue bg-sio-blue/[0.02] ring-1 ring-sio-blue dark:border-sio-teal dark:bg-sio-teal/[0.02] dark:ring-sio-teal shadow-sm"
                            : "border-border bg-background hover:border-sio-blue/20 dark:hover:border-sio-teal/20"
                        }`}
                      >
                        <span
                          className={`text-lg font-bold ${isSelected ? "text-sio-blue dark:text-sio-teal" : "text-foreground"}`}
                        >
                          {preset.label}
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                          {preset.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Button Toggle */}
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleAmountChange("custom")}
                      className={`flex-1 sm:flex-initial px-6 py-3 rounded-lg border text-sm font-bold transition-all cursor-pointer ${
                        amountPreset === "custom"
                          ? "border-sio-blue bg-sio-blue/[0.02] dark:border-sio-teal dark:bg-sio-teal/[0.02] text-sio-blue dark:text-sio-teal"
                          : "border-border bg-background hover:border-sio-blue/20 dark:hover:border-sio-teal/20 text-muted-foreground"
                      }`}
                    >
                      Custom Amount
                    </button>
                  </div>

                  {/* Custom Amount Input Box */}
                  <AnimatePresence>
                    {amountPreset === "custom" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <div className="relative w-full rounded-lg border bg-background flex items-center pr-3 focus-within:ring-1 focus-within:ring-sio-blue dark:focus-within:ring-sio-teal">
                          <span className="pl-4 text-sm font-bold text-muted-foreground">₦</span>
                          <input
                            type="number"
                            placeholder="Minimum ₦500"
                            value={customAmountText}
                            onChange={(e) => handleCustomTextChange(e.target.value)}
                            className="w-full bg-transparent pl-2 pr-4 py-2.5 text-sm text-foreground focus:outline-none"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {errors.amount && (
                    <p className="text-xs text-destructive mt-1 font-semibold">{errors.amount}</p>
                  )}
                </div>

                <div className="border-t border-border my-6" />

                {/* Donor Details */}
                <div className="space-y-6">
                  <h4 className="text-lg font-serif font-bold text-foreground">
                    Donor Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="donor-name"
                        className={`text-xs font-bold uppercase tracking-wider transition-colors ${errors.name ? "text-destructive" : "text-foreground"}`}
                      >
                        Full Name
                      </label>
                      <input
                        id="donor-name"
                        type="text"
                        placeholder="e.g. Chioma Nwachukwu"
                        value={form.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ${
                          errors.name
                            ? "border-destructive focus:border-destructive focus:ring-destructive"
                            : "border-border focus:border-sio-blue focus:ring-sio-blue dark:focus:border-sio-teal dark:focus:ring-sio-teal"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive mt-1 font-semibold">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="donor-phone"
                        className={`text-xs font-bold uppercase tracking-wider transition-colors ${errors.phone ? "text-destructive" : "text-foreground"}`}
                      >
                        Phone Number
                      </label>
                      <input
                        id="donor-phone"
                        type="tel"
                        placeholder="e.g. +234 802 345 6789"
                        value={form.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ${
                          errors.phone
                            ? "border-destructive focus:border-destructive focus:ring-destructive"
                            : "border-border focus:border-sio-blue focus:ring-sio-blue dark:focus:border-sio-teal dark:focus:ring-sio-teal"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-xs text-destructive mt-1 font-semibold">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="donor-email"
                      className={`text-xs font-bold uppercase tracking-wider transition-colors ${errors.email ? "text-destructive" : "text-foreground"}`}
                    >
                      Email Address
                    </label>
                    <input
                      id="donor-email"
                      type="email"
                      placeholder="e.g. chioma@gmail.com"
                      value={form.email}
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                      className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ${
                        errors.email
                          ? "border-destructive focus:border-destructive focus:ring-destructive"
                          : "border-border focus:border-sio-blue focus:ring-sio-blue dark:focus:border-sio-teal dark:focus:ring-sio-teal"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1 font-semibold">{errors.email}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CustomSelect
                      id="donor-interval"
                      label="Donation Frequency"
                      value={form.interval}
                      onChange={(val) => handleFieldChange("interval", val)}
                      error={errors.interval}
                      options={[
                        { value: "once", label: "One-Time Donation" },
                        { value: "monthly", label: "Monthly Partnership" },
                        { value: "annual", label: "Annual Sponsorship" },
                      ]}
                    />
                    <CustomSelect
                      id="donor-preference"
                      label="Fund Allocation"
                      value={form.preference}
                      onChange={(val) => handleFieldChange("preference", val)}
                      error={errors.preference}
                      options={[
                        { value: "general", label: "General Impact Fund (Where needed most)" },
                        { value: "education", label: "Education & Tutors Support" },
                        { value: "nutrition", label: "Nutritional Feeding Support" },
                        { value: "wellness", label: "Wellness Hub & Health Supplies" },
                      ]}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-lg bg-sio-blue hover:bg-sio-blue/90 text-white dark:bg-sio-teal dark:text-sio-navy dark:hover:bg-sio-teal/90 py-6 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <CreditCard size={18} weight="bold" />
                  Proceed to Secure Checkout
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <div className="h-16 w-16 rounded-full bg-sio-teal/20 text-sio-teal flex items-center justify-center mb-6">
                  <CheckCircle
                    size={40}
                    weight="fill"
                    className="text-sio-blue dark:text-sio-teal"
                  />
                </div>
                <h3 className="text-3xl font-serif font-bold text-foreground mb-3">
                  Thank You for Your Partnership!
                </h3>
                <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-8">
                  Your pledge of{" "}
                  <span className="font-bold text-foreground">{selectedAmountLabel}</span> has been
                  processed. An audit statement and donation receipt have been sent to{" "}
                  <span className="font-bold text-foreground">{form.email}</span>. Your generosity
                  supports real change on the ground.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setAmountPreset(15000);
                      setCustomAmountText("");
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        interval: "monthly",
                        preference: "general",
                      });
                    }}
                    className="rounded-full bg-sio-blue hover:bg-sio-blue/90 text-white dark:bg-sio-teal dark:text-sio-navy dark:hover:bg-sio-teal/90 font-bold px-8 py-2.5 text-sm"
                  >
                    Donate Again
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-border bg-background hover:bg-muted font-bold px-8 py-2.5 text-sm"
                  >
                    <Link href="/">Back to Homepage</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 3. AUDITS & TRUST GRID */}
      <section className="py-16 px-6 lg:px-8 border-t border-border bg-muted/20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <span className="text-xs font-mono font-bold text-sio-blue dark:text-sio-teal">
                01 / Stewardship
              </span>
              <h4 className="text-base font-bold text-foreground mt-2 mb-2">
                Transparency & Governance
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We publish detailed financial audits annually. SIO is registered in Nigeria and
                operates with local oversight.
              </p>
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-sio-blue dark:text-sio-teal">
                02 / Direct Funding
              </span>
              <h4 className="text-base font-bold text-foreground mt-2 mb-2">
                90% Efficiency Rating
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                90 kobo of every Naira donated goes directly into child feeding, tuition fees, and
                wellness hubs support.
              </p>
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-sio-blue dark:text-sio-teal">
                03 / Continuous Updates
              </span>
              <h4 className="text-base font-bold text-foreground mt-2 mb-2">Progress Reporting</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our partners receive quarterly progress updates detailing children&apos;s grades,
                wellness scores, and stories.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
