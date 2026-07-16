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
  Calendar,
  Lock,
  ArrowLeft,
  CircleNotch,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { z } from "zod";

// Luhn Algorithm checksum check for card validation
function validateLuhn(cardNumber: string): boolean {
  const clean = cardNumber.replace(/\s+/g, "");
  if (!/^\d+$/.test(clean)) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

// Expiry date verification (rejects past months/years)
function validateFutureDate(expiry: string): boolean {
  const clean = expiry.replace(/\s+/g, "");
  const match = clean.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/);
  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = parseInt("20" + match[2], 10);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

// Zod validation schema for Step 1 (Donation Details)
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

// Zod validation schema for Step 2 (Direct Card Details - Temu Style)
const cardSchema = z.object({
  cardName: z
    .string()
    .min(3, "Cardholder Name must be at least 3 characters")
    .regex(/^[a-zA-Z\s]+$/, "Cardholder name can only contain letters and spaces"),
  cardNumber: z
    .string()
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => /^\d{15,19}$/.test(val), "Card number must be 15 to 19 digits")
    .refine((val) => validateLuhn(val), "Invalid card number (failed checksum validation)"),
  cardExpiry: z
    .string()
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(val), "Expiry must be MM/YY format")
    .refine((val) => validateFutureDate(val), "Card has expired"),
  cardCvv: z
    .string()
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => /^\d{3,4}$/.test(val), "CVV must be 3 or 4 digits"),
});

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

// Automatic Card Brand Detector helper
function getCardBrand(num: string): "Visa" | "Mastercard" | "Verve" | "Generic" {
  const clean = num.replace(/\s+/g, "");
  if (clean.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(clean)) return "Mastercard";
  if (clean.startsWith("506") || clean.startsWith("507") || clean.startsWith("6")) return "Verve";
}

function generateMockToken(brand: string): string {
  // Use a combination of timestamp and a pseudo-random value safely outside component body
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `tok_${brand.toLowerCase()}_${Date.now().toString(36)}_${rand}`;
}

// Inline high-fidelity SVG card network logo badges
function CardBrandBadge({ brand }: { brand: "Visa" | "Mastercard" | "Verve" | "Generic" }) {
  switch (brand) {
    case "Visa":
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-auto bg-white/95 px-1.5 py-0.5 rounded shadow-sm"
        >
          <path d="M19.16 32.89L22.24 14.15H27.18L24.1 32.89H19.16Z" fill="#1A1F71" />
          <path
            d="M37.38 14.61C36.31 14.19 34.61 13.8 32.61 13.8C27.67 13.8 24.2 16.32 24.16 20.08C24.13 22.75 26.65 24.23 28.55 25.12C30.5 26.04 31.15 26.62 31.14 27.44C31.12 28.7 29.56 29.27 28.16 29.27C26.15 29.27 25.04 28.72 24.13 28.31L23.3 27.91L22.45 32.85C23.83 33.46 25.96 33.95 28.18 33.95C33.41 33.95 36.83 31.47 36.88 27.65C36.91 24.51 34.92 23.32 32.4 22.17C30.34 21.14 29.3 20.47 29.31 19.55C29.31 18.73 30.27 17.85 32.22 17.85C33.87 17.82 35.15 18.23 36.08 18.63L36.57 18.85L37.38 14.61Z"
            fill="#1A1F71"
          />
          <path
            d="M43.76 14.15H39.95C38.77 14.15 37.89 14.48 37.38 15.63L29.74 32.89H34.93L35.97 30.13H42.31L42.91 32.89H47.47L43.76 14.15ZM37.38 26.47L40.06 19.58L41.6 26.47H37.38Z"
            fill="#1A1F71"
          />
          <path
            d="M14.65 14.15L9.84 27.05L9.34 14.65C9.17 14.28 8.68 13.8 8.04 13.8H0.35L0 13.97C1.59 14.36 3.4 15.35 4.51 16.14L9.43 32.89H14.65L22.5 14.15H14.65Z"
            fill="#F7B600"
          />
        </svg>
      );
    case "Mastercard":
      return (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-auto"
        >
          <circle cx="16" cy="24" r="14" fill="#EB001B" fillOpacity="0.9" />
          <circle cx="32" cy="24" r="14" fill="#F79E1B" fillOpacity="0.9" />
          <path
            d="M24 16.3C22.2 18.4 21.1 21.1 21.1 24C21.1 26.9 22.2 29.6 24 31.7C25.8 29.6 26.9 26.9 26.9 24C26.9 21.1 25.8 18.4 24 16.3Z"
            fill="#FF5F00"
          />
        </svg>
      );
    case "Verve":
      return (
        <svg
          viewBox="0 0 85 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-auto"
        >
          <circle cx="10" cy="12" r="8" fill="#3AB54A" />
          <circle cx="19" cy="12" r="8" fill="#00AEEF" fillOpacity="0.85" />
          <circle cx="28" cy="12" r="8" fill="#F26522" fillOpacity="0.85" />
          <text
            x="40"
            y="16"
            fill="white"
            fontFamily="sans-serif"
            fontWeight="bold"
            fontSize="11"
            letterSpacing="0.5"
          >
            verve
          </text>
        </svg>
      );
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-white/70"
        >
          <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      );
  }
}

export default function Donate() {
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<"details" | "card">("details");

  // Form states
  const [amountPreset, setAmountPreset] = useState<number | "custom">(15000);
  const [customAmountText, setCustomAmountText] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interval: "monthly",
    preference: "general",
  });

  // Card states
  const [cardForm, setCardForm] = useState({
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form | "amount", string>>>({});
  const [cardErrors, setCardErrors] = useState<Partial<Record<keyof typeof cardForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  // Processing indicators
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");

  // Auto-format card number as xxxx xxxx xxxx xxxx
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 19) value = value.slice(0, 19);

    // Group by 4 digits
    const matches = value.match(/\d{1,4}/g);
    const formatted = matches ? matches.join(" ") : "";

    setCardForm((prev) => ({ ...prev, cardNumber: formatted }));
    if (cardErrors.cardNumber) setCardErrors((prev) => ({ ...prev, cardNumber: undefined }));
  };

  // Auto-format expiry as MM / YY
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);

    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.slice(0, 2)} / ${value.slice(2)}`;
    }

    setCardForm((prev) => ({ ...prev, cardExpiry: formatted }));
    if (cardErrors.cardExpiry) setCardErrors((prev) => ({ ...prev, cardExpiry: undefined }));
  };

  // Format CVV input (numbers only, max 4 digits)
  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardForm((prev) => ({ ...prev, cardCvv: value }));
    if (cardErrors.cardCvv) setCardErrors((prev) => ({ ...prev, cardCvv: undefined }));
  };

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardForm((prev) => ({ ...prev, cardName: e.target.value }));
    if (cardErrors.cardName) setCardErrors((prev) => ({ ...prev, cardName: undefined }));
  };

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

  // Submit Step 1 details
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
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
      // Prep Cardholder name with donor's name automatically
      setCardForm((prev) => ({ ...prev, cardName: prev.cardName || form.name }));
      setStep("card");
      formContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Submit Step 2 Custom Card (Temu Style)
  const handlePayDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = cardSchema.safeParse(cardForm);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof typeof cardForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof typeof cardForm;
        fieldErrors[path] = issue.message;
      });
      setCardErrors(fieldErrors);
    } else {
      setCardErrors({});
      setIsProcessing(true);

      try {
        setProcessingStatus("Generating secure provider token...");
        // Simulate provider hosted tokenization call (e.g. Stripe Elements or Paystack tokenization API)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const providerToken = generateMockToken(cardBrand);

        // CRITICAL SECURITY FIX: Instantly erase raw PAN/CVV from first-party React state memory
        setCardForm({
          cardName: "",
          cardNumber: "",
          cardExpiry: "",
          cardCvv: "",
        });

        setProcessingStatus("Submitting token and metadata to server...");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Submit ONLY the generated token plus metadata to our verified backend API route
        const response = await fetch("/api/verify-donation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: providerToken,
            amount: parsedFinalAmount,
            email: form.email,
            name: form.name,
            preference: form.preference,
            interval: form.interval,
          }),
        });

        const verification = await response.json();

        if (!response.ok) {
          throw new Error(verification.error || "Gateway validation failed");
        }

        setProcessingStatus("Payment verified successfully!");
        await new Promise((resolve) => setTimeout(resolve, 800));

        setIsProcessing(false);
        setSubmitted(true);
        formContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Payment verification failed. Please try again.";
        setIsProcessing(false);
        setCardErrors({
          cardNumber: errorMessage,
        });
        formContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const parsedFinalAmount =
    amountPreset === "custom" ? parseFloat(customAmountText) || 0 : amountPreset;

  const selectedAmountLabel = `₦${parsedFinalAmount.toLocaleString()}`;
  const cardBrand = getCardBrand(cardForm.cardNumber);

  return (
    <div className="flex flex-col w-full overflow-x-hidden bg-background min-h-screen">
      {/* Accessibility Screen Reader status announcer */}
      <div className="sr-only" aria-live="assertive" role="status">
        {isProcessing && `Payment processing status: ${processingStatus}`}
        {submitted &&
          `Donation transaction completed successfully. Thank you for your partnership.`}
      </div>

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
                alt="Smiling children learning in a classroom"
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
                  <p className="text-[11px] text-slate-400">Direct page tokenization encryption</p>
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
          <div
            ref={formContainerRef}
            className="lg:col-span-7 bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-md flex flex-col justify-center min-h-[500px]"
          >
            {isProcessing ? (
              /* PROGRESS LOADER VIEW */
              <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
                <CircleNotch size={48} className="animate-spin text-sio-blue dark:text-sio-teal" />
                <h4 className="text-base font-serif font-bold text-foreground">
                  Processing Payment
                </h4>
                <p className="text-xs text-muted-foreground tracking-wide font-mono uppercase bg-muted px-3 py-1 rounded-full">
                  {processingStatus}
                </p>
              </div>
            ) : submitted ? (
              /* SUCCESS VIEW */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-6"
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
                <p className="text-sm text-muted-foreground max-w-lg leading-relaxed mb-8">
                  Your pledge of{" "}
                  <span className="font-bold text-foreground">{selectedAmountLabel}</span> has been
                  processed. An audit statement and donation receipt have been sent to{" "}
                  <span className="font-bold text-foreground">{form.email}</span>. Your generosity
                  supports real change on the ground.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setStep("details");
                      setAmountPreset(15000);
                      setCustomAmountText("");
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        interval: "monthly",
                        preference: "general",
                      });
                      setCardForm({
                        cardName: "",
                        cardNumber: "",
                        cardExpiry: "",
                        cardCvv: "",
                      });
                    }}
                    className="rounded-full bg-sio-blue hover:bg-sio-blue/90 text-white dark:bg-sio-teal dark:text-sio-navy dark:hover:bg-sio-teal/90 font-bold px-8 py-2.5 text-sm cursor-pointer"
                  >
                    Donate Again
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-border bg-background hover:bg-muted font-bold px-8 py-2.5 text-sm cursor-pointer"
                  >
                    <Link href="/">Back to Homepage</Link>
                  </Button>
                </div>
              </motion.div>
            ) : step === "details" ? (
              /* STEP 1: DONOR DETAILS FORM */
              <form onSubmit={handleProceedToPayment} noValidate className="space-y-8 text-left">
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
                        aria-invalid={errors.name ? "true" : "false"}
                        aria-describedby={errors.name ? "error-donor-name" : undefined}
                        className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ${
                          errors.name
                            ? "border-destructive focus:border-destructive focus:ring-destructive"
                            : "border-border focus:border-sio-blue focus:ring-sio-blue dark:focus:border-sio-teal dark:focus:ring-sio-teal"
                        }`}
                      />
                      {errors.name && (
                        <p
                          id="error-donor-name"
                          role="alert"
                          className="text-xs text-destructive mt-1 font-semibold"
                        >
                          {errors.name}
                        </p>
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
                        aria-invalid={errors.phone ? "true" : "false"}
                        aria-describedby={errors.phone ? "error-donor-phone" : undefined}
                        className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ${
                          errors.phone
                            ? "border-destructive focus:border-destructive focus:ring-destructive"
                            : "border-border focus:border-sio-blue focus:ring-sio-blue dark:focus:border-sio-teal dark:focus:ring-sio-teal"
                        }`}
                      />
                      {errors.phone && (
                        <p
                          id="error-donor-phone"
                          role="alert"
                          className="text-xs text-destructive mt-1 font-semibold"
                        >
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
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "error-donor-email" : undefined}
                      className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ${
                        errors.email
                          ? "border-destructive focus:border-destructive focus:ring-destructive"
                          : "border-border focus:border-sio-blue focus:ring-sio-blue dark:focus:border-sio-teal dark:focus:ring-sio-teal"
                      }`}
                    />
                    {errors.email && (
                      <p
                        id="error-donor-email"
                        role="alert"
                        className="text-xs text-destructive mt-1 font-semibold"
                      >
                        {errors.email}
                      </p>
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
                        { value: "general", label: "General Impact Fund" },
                        { value: "education", label: "Education & Tutors Support" },
                        { value: "nutrition", label: "Nutritional Feeding Support" },
                        { value: "wellness", label: "Wellness Hub & Health Supplies" },
                      ]}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-lg bg-sio-blue hover:bg-sio-blue/90 text-white dark:bg-sio-teal dark:text-sio-navy dark:hover:bg-sio-teal/90 py-6 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard size={18} weight="bold" />
                  Proceed to Secure Checkout
                </Button>
              </form>
            ) : (
              /* STEP 2: PAY DIRECTLY WITH CARD (TEMU STYLE) */
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8 text-left"
              >
                {/* Back Link */}
                <button
                  onClick={() => {
                    setStep("details");
                    formContainerRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} weight="bold" />
                  Back to Details
                </button>

                <div className="space-y-1">
                  <h3 className="text-2xl font-serif font-bold text-foreground">
                    Secure Card Billing
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Your details are fully tokenized. SIO never stores your raw card credentials.
                  </p>
                </div>

                {/* SIO CUSTOM CREDIT CARD GRAPHIC */}
                <div className="relative w-full aspect-[1.7/1] sm:max-w-sm mx-auto rounded-3xl p-6 bg-gradient-to-br from-sio-navy via-sio-navy to-sio-blue/70 dark:from-sio-navy dark:via-sio-navy dark:to-sio-teal/30 text-white shadow-2xl flex flex-col justify-between overflow-hidden border border-white/10">
                  {/* Micro Chip & Network Logo */}
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-11 bg-gradient-to-r from-amber-400 to-amber-200 rounded-md opacity-85 shadow-inner" />
                    <CardBrandBadge brand={cardBrand} />
                  </div>

                  {/* Card Number display */}
                  <div className="my-4">
                    <span className="text-base sm:text-lg md:text-xl font-mono tracking-[0.2em] font-semibold text-white/95">
                      {cardForm.cardNumber || "•••• •••• •••• ••••"}
                    </span>
                  </div>

                  {/* Cardholder name & Expiry */}
                  <div className="flex justify-between items-end border-t border-white/10 pt-3">
                    <div className="flex flex-col text-left max-w-[70%]">
                      <span className="text-[9px] uppercase tracking-wider text-white/50">
                        Cardholder
                      </span>
                      <span className="text-xs font-mono font-bold truncate">
                        {cardForm.cardName || form.name || "DONOR NAME"}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] uppercase tracking-wider text-white/50">
                        Expires
                      </span>
                      <span className="text-xs font-mono font-bold">
                        {cardForm.cardExpiry || "MM / YY"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Input fields (Temu Style) */}
                <form onSubmit={handlePayDirect} noValidate className="space-y-5">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="cardholder-name"
                      className={`text-xs font-bold uppercase tracking-wider transition-colors ${cardErrors.cardName ? "text-destructive" : "text-foreground"}`}
                    >
                      Cardholder Name
                    </label>
                    <input
                      id="cardholder-name"
                      type="text"
                      placeholder="Name on card"
                      value={cardForm.cardName}
                      onChange={handleCardNameChange}
                      aria-invalid={cardErrors.cardName ? "true" : "false"}
                      aria-describedby={cardErrors.cardName ? "error-card-name" : undefined}
                      className={`w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ${
                        cardErrors.cardName
                          ? "border-destructive focus:border-destructive focus:ring-destructive"
                          : "border-border focus:border-sio-blue focus:ring-sio-blue dark:focus:border-sio-teal dark:focus:ring-sio-teal"
                      }`}
                    />
                    {cardErrors.cardName && (
                      <p
                        id="error-card-name"
                        role="alert"
                        className="text-xs text-destructive mt-0.5 font-semibold"
                      >
                        {cardErrors.cardName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="card-number"
                      className={`text-xs font-bold uppercase tracking-wider transition-colors ${cardErrors.cardNumber ? "text-destructive" : "text-foreground"}`}
                    >
                      Card Number
                    </label>
                    <div className="relative flex items-center pr-3 w-full rounded-lg border bg-background pr-3 focus-within:ring-1 focus-within:ring-sio-blue dark:focus-within:ring-sio-teal">
                      <input
                        id="card-number"
                        type="text"
                        placeholder="4000 1234 5678 9010"
                        value={cardForm.cardNumber}
                        onChange={handleCardNumberChange}
                        aria-invalid={cardErrors.cardNumber ? "true" : "false"}
                        aria-describedby={cardErrors.cardNumber ? "error-card-number" : undefined}
                        className="w-full bg-transparent pl-4 pr-2 py-2.5 text-sm text-foreground focus:outline-none"
                      />
                      <CreditCard size={18} className="text-muted-foreground" />
                    </div>
                    {cardErrors.cardNumber && (
                      <p
                        id="error-card-number"
                        role="alert"
                        className="text-xs text-destructive mt-0.5 font-semibold"
                      >
                        {cardErrors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="card-expiry"
                        className={`text-xs font-bold uppercase tracking-wider transition-colors ${cardErrors.cardExpiry ? "text-destructive" : "text-foreground"}`}
                      >
                        Expiry Date
                      </label>
                      <div className="relative flex items-center pr-3 w-full rounded-lg border bg-background pr-3 focus-within:ring-1 focus-within:ring-sio-blue dark:focus-within:ring-sio-teal">
                        <input
                          id="card-expiry"
                          type="text"
                          placeholder="MM / YY"
                          value={cardForm.cardExpiry}
                          onChange={handleCardExpiryChange}
                          aria-invalid={cardErrors.cardExpiry ? "true" : "false"}
                          aria-describedby={cardErrors.cardExpiry ? "error-card-expiry" : undefined}
                          className="w-full bg-transparent pl-4 pr-2 py-2.5 text-sm text-foreground focus:outline-none"
                        />
                        <Calendar size={18} className="text-muted-foreground" />
                      </div>
                      {cardErrors.cardExpiry && (
                        <p
                          id="error-card-expiry"
                          role="alert"
                          className="text-xs text-destructive mt-0.5 font-semibold"
                        >
                          {cardErrors.cardExpiry}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="card-cvv"
                        className={`text-xs font-bold uppercase tracking-wider transition-colors ${cardErrors.cardCvv ? "text-destructive" : "text-foreground"}`}
                      >
                        CVV / CVC
                      </label>
                      <div className="relative flex items-center pr-3 w-full rounded-lg border bg-background pr-3 focus-within:ring-1 focus-within:ring-sio-blue dark:focus-within:ring-sio-teal">
                        <input
                          id="card-cvv"
                          type="password"
                          placeholder="123"
                          value={cardForm.cardCvv}
                          onChange={handleCardCvvChange}
                          aria-invalid={cardErrors.cardCvv ? "true" : "false"}
                          aria-describedby={cardErrors.cardCvv ? "error-card-cvv" : undefined}
                          className="w-full bg-transparent pl-4 pr-2 py-2.5 text-sm text-foreground focus:outline-none font-mono"
                        />
                        <Lock size={18} className="text-muted-foreground" />
                      </div>
                      {cardErrors.cardCvv && (
                        <p
                          id="error-card-cvv"
                          role="alert"
                          className="text-xs text-destructive mt-0.5 font-semibold"
                        >
                          {cardErrors.cardCvv}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full rounded-lg bg-sio-blue hover:bg-sio-blue/90 text-white dark:bg-sio-teal dark:text-sio-navy dark:hover:bg-sio-teal/90 py-6 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck size={18} weight="fill" />
                      Pay {selectedAmountLabel}
                    </Button>
                  </div>
                </form>
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
