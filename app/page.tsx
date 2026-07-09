"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  BookOpen,
  ForkKnife,
  Sparkle,
  Heart,
  ArrowRight,
  ShieldCheck,
  Globe,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import CountUp from "@/components/CountUp";

export default function Home() {
  // Animation presets
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  } as const;

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  } as const;

  const cardHover = {
    hover: {
      y: -8,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  } as const;

  return (
    <div className="flex flex-col w-full overflow-x-hidden bg-background">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center py-20 px-6 lg:px-8 border-b border-border bg-gradient-to-br from-background via-background to-sio-blue/5">
        <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left (Text & Buttons) */}
          <motion.div
            className="lg:col-span-7 flex flex-col text-left"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sio-blue dark:text-sio-teal bg-sio-blue/10 dark:bg-sio-teal/10 px-3 py-1.5 rounded-full mb-6 w-fit"
            >
              <Heart size={12} weight="fill" className="text-sio-blue dark:text-sio-teal" />
              Nurturing Slum Youth
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-foreground leading-[1.1] mb-6"
            >
              Giving Every Child in the Slum the Opportunity to{" "}
              <span className="text-sio-blue dark:text-sio-teal underline decoration-sio-teal decoration-wavy underline-offset-4">
                Shine
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl"
            >
              Slum Impact Organization (SIO) is dedicated to transforming the lives of vulnerable
              children living in urban slums. We provide quality education, nutritious daily meals,
              healthcare, and creative development platforms to pave their way out of poverty.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
            >
              <Button
                asChild
                className="rounded-full bg-sio-blue hover:bg-sio-blue/90 text-white font-semibold shadow-lg hover:shadow-xl dark:bg-sio-teal dark:text-sio-navy dark:hover:bg-sio-teal/90 px-8 py-6 text-base transition-all duration-300"
              >
                <Link href="/donate" className="flex items-center gap-2">
                  <span>Sponsor a Child</span>
                  <ArrowRight size={18} weight="bold" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-border bg-card text-foreground hover:bg-muted font-semibold px-8 py-6 text-base transition-all duration-300"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Right (Branded Image & Overlays) */}
          <motion.div
            className="lg:col-span-5 relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {/* Main Image in Elegant Frame */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-border bg-muted">
              <Image
                src="/images/hero_children.jpg"
                alt="Hopeful children smiling and learning"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Floating Glassmorphism Badge 1 */}
            <motion.div
              className="absolute -top-6 -left-6 bg-background/80 backdrop-blur-md border border-border p-4 rounded-2xl shadow-xl flex items-center gap-3 hidden sm:flex"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <div className="h-10 w-10 rounded-full bg-sio-blue/15 flex items-center justify-center text-sio-blue dark:text-sio-teal">
                <ShieldCheck size={22} weight="bold" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-muted-foreground leading-none">Safe Spaces</span>
                <span className="text-sm font-bold text-foreground">Verified NGO</span>
              </div>
            </motion.div>

            {/* Floating Glassmorphism Badge 2 */}
            <motion.div
              className="absolute -bottom-6 -right-6 bg-background/80 backdrop-blur-md border border-border p-4 rounded-2xl shadow-xl flex items-center gap-3"
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
            >
              <div className="h-10 w-10 rounded-full bg-sio-teal/20 flex items-center justify-center text-sio-navy">
                <Globe size={22} weight="bold" className="text-sio-blue dark:text-sio-teal" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-muted-foreground leading-none">Active Community</span>
                <span className="text-sm font-bold text-foreground">500+ Children Enrolled</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="py-12 bg-sio-navy text-white transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { end: 1200, suffix: "+", label: "Children Educated" },
              { end: 150, suffix: "k+", label: "Nutritious Meals Served" },
              { end: 4, suffix: "+", label: "Slum Centers Built" },
              { end: 92, suffix: "%", label: "High-School Enrollment" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="text-3xl sm:text-4xl font-black font-sans text-sio-teal">
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </span>
                <span className="text-xs sm:text-sm font-medium tracking-wide text-slate-300 uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE PROGRAMS SECTION */}
      <section className="py-20 px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl text-center">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-sio-blue dark:text-sio-teal">
              Our Initiatives
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight mt-2 mb-4">
              How We Create Impact
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We tackle the multi-dimensional challenges faced by children living in poverty. By
              providing a holistic support system, we nurture their mind, body, and creative spirit.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Education Support",
                description:
                  "Knowledge is freedom. We provide free school supplies, tuition support, literacy materials, and weekend mentoring programs to keep children inspired and in school.",
                icon: <BookOpen size={24} weight="bold" />,
                image: "/images/program_education.jpg",
                colorClass: "bg-sio-blue/10 text-sio-blue dark:bg-sio-teal/10 dark:text-sio-teal",
              },
              {
                title: "Nutrition & Health",
                description:
                  "Healthy bodies foster alert minds. Our feeding program ensures children receive a hot, nutritionally balanced meal daily alongside regular health check-ups.",
                icon: <ForkKnife size={24} weight="bold" />,
                image: "/images/program_nutrition.jpg",
                colorClass: "bg-sio-teal/20 text-sio-navy dark:bg-sio-teal/10 dark:text-sio-teal",
              },
              {
                title: "Creative & Talent",
                description:
                  "Unlocking unique potential. We provide children with safe avenues to discover and explore their gifts in sports, arts, photography, music, and dance.",
                icon: <Sparkle size={24} weight="bold" />,
                image: "/images/program_talent.jpg",
                colorClass: "bg-sio-blue/10 text-sio-blue dark:bg-sio-teal/10 dark:text-sio-teal",
              },
            ].map((program, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col bg-background rounded-2xl overflow-hidden border border-border shadow-sm text-left"
                variants={cardHover}
                whileHover="hover"
              >
                {/* Program Card Image */}
                <div className="relative w-full aspect-[4/3] bg-muted">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Program Card Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${program.colorClass}`}
                  >
                    {program.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{program.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {program.description}
                  </p>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sio-blue dark:text-sio-teal mt-6 hover:underline uppercase tracking-wider"
                  >
                    <span>Read Details</span>
                    <ArrowRight size={12} weight="bold" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION SECTION */}
      <section className="py-20 px-6 lg:px-8 relative overflow-hidden bg-background">
        {/* Background gradient block */}
        <div className="absolute inset-0 bg-gradient-to-tr from-sio-blue/5 to-sio-teal/5 opacity-80" />

        <div className="mx-auto max-w-5xl relative z-10">
          <div className="bg-sio-navy text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-sio-teal/30 shadow-2xl flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-sio-teal bg-white/10 px-3 py-1 rounded-full mb-6">
              <Heart size={14} weight="fill" />
              Join Hands With SIO
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white mb-6 max-w-2xl leading-tight">
              You Can Change a Child&apos;s Story Today
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
              Whether you sponsor a child&apos;s education, volunteer your skills at our hubs, or
              provide support, your generosity opens doors of hope and opportunity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-stretch justify-center">
              <Button
                asChild
                className="rounded-full bg-sio-teal text-sio-navy hover:bg-sio-teal/90 font-bold px-8 py-5 text-base shadow-lg transition-transform hover:scale-105 duration-200"
              >
                <Link href="/donate">Donate Safely</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white font-bold px-8 py-5 text-base transition-transform hover:scale-105 duration-200"
              >
                <Link href="/volunteer">Be a Volunteer</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
