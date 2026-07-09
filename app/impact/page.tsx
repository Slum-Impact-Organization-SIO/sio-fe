"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  GraduationCap,
  ForkKnife,
  Heart,
  TrendUp,
  Coins,
  Users,
  ShieldCheck,
  ArrowRight,
} from "@phosphor-icons/react";
import CountUp from "@/components/CountUp";
import { Button } from "@/components/ui/button";

export default function Impact() {
  // Animation presets
  const fadeInUp = {
    initial: { opacity: 0, y: 35 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  } as const;

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const;

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
            <TrendUp size={12} weight="bold" />
            SIO Annual Impact Report
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Our Real-World Impact
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Transparency in action. Explore the numbers, life stories, and developmental milestones
            of the children in our care.
          </motion.p>
        </div>
      </section>

      {/* 2. DYNAMIC COUNTERS GRID */}
      <section className="py-16 px-6 lg:px-8 border-b border-border bg-muted/10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                end: 1200,
                suffix: "+",
                label: "Children Educated",
                desc: "Supported with tuition, libraries, uniforms, and books.",
                icon: (
                  <GraduationCap
                    size={26}
                    weight="fill"
                    className="text-sio-blue dark:text-sio-teal"
                  />
                ),
              },
              {
                end: 150,
                suffix: "k+",
                label: "Nutritious Meals",
                desc: "Fresh, hot meals prepared daily by local community mothers.",
                icon: (
                  <ForkKnife size={26} weight="fill" className="text-sio-teal dark:text-sio-teal" />
                ),
              },
              {
                end: 350,
                suffix: "+",
                label: "Secondary Scholarships",
                desc: "Guaranteed pathways for high-performing children.",
                icon: (
                  <Coins size={26} weight="fill" className="text-sio-blue dark:text-sio-teal" />
                ),
              },
              {
                end: 45,
                suffix: "+",
                label: "Active Mentors",
                desc: "Educators and counselors driving the hub programs.",
                icon: (
                  <Users size={26} weight="fill" className="text-sio-teal dark:text-sio-teal" />
                ),
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-black text-foreground mb-1">
                    <CountUp end={stat.end} suffix={stat.suffix} />
                  </h3>
                  <h4 className="text-sm font-bold text-foreground mb-2">{stat.label}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED SUCCESS STORY */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Story Image (Left) */}
          <div className="lg:col-span-5 relative order-last lg:order-first">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-border bg-muted">
              <Image
                src="/images/success_story.jpg"
                alt="Beatrice holding her notebook, smiling with hope"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
            {/* Background Accent Box */}
            <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full rounded-3xl bg-gradient-to-br from-sio-blue/15 to-sio-teal/15 border border-sio-teal/10" />
          </div>

          {/* Story Content (Right) */}
          <div className="lg:col-span-7 flex flex-col text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-sio-blue dark:text-sio-teal mb-2">
              Featured Success Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight mb-6">
              From the Streets to the Classroom: Beatrice&apos;s Journey
            </h2>
            <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
              <p>
                Growing up in Sector 4 of the slum area, Beatrice spent her early childhood helping
                her grandmother fetch clean water and search for scrap plastic. By age nine, she had
                never stepped inside a school. Her future seemed locked within the generational
                cycles of poverty.
              </p>
              <p>
                That changed when SIO team members met her during a community mapping exercise.
                Beatrice was enrolled in our primary education program, where she received
                textbooks, mentoring, and daily meals. Our counselors quickly noticed her passion
                for sketching and enrolled her in the weekend Talent Hub.
              </p>
              <p>
                Today, Beatrice is on a full secondary school scholarship. She is excelling in her
                classes and aims to study graphic design. Her story is a shining testament to what
                happens when we provide slum youth with safety, nutrition, and equal educational
                opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINANCIAL TRANSPARENCY SECTION */}
      <section className="py-20 px-6 lg:px-8 bg-muted/20 border-y border-border">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-sio-blue dark:text-sio-teal">
            Donation Stewardship
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mt-2 mb-4">
            How We Allocate Donations
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
            Transparency is central to our organization. For every Naira donated, 90 kobo goes
            directly into child enrichment and wellness programs, with only 10 kobo allocated to
            administrative operations.
          </p>

          {/* Animated Progress Bars */}
          <motion.div
            className="space-y-6 text-left"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Education, Scholarships & Mentorship",
                percentage: 45,
                colorClass: "bg-sio-blue dark:bg-sio-teal",
              },
              {
                title: "Daily Nutrition & Feeding Hubs",
                percentage: 30,
                colorClass: "bg-sio-blue/80 dark:bg-sio-teal/80",
              },
              {
                title: "Healthcare, Hygiene & Child Safety",
                percentage: 15,
                colorClass: "bg-sio-blue/60 dark:bg-sio-teal/60",
              },
              {
                title: "Hub Operations, Volunteers & Administration",
                percentage: 10,
                colorClass: "bg-sio-blue/40 dark:bg-sio-teal/40",
              },
            ].map((program, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-foreground">
                  <span>{program.title}</span>
                  <span>{program.percentage}%</span>
                </div>
                <div className="h-3 w-full bg-border rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${program.colorClass}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${program.percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. GET INVOLVED CALL TO ACTION */}
      <section className="py-20 px-6 lg:px-8 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-tr from-sio-blue/5 to-sio-teal/5 opacity-80" />
        <div className="mx-auto max-w-5xl relative z-10">
          <div className="bg-[#001F56] text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-sio-teal/30 shadow-2xl flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-sio-teal bg-white/10 px-3 py-1 rounded-full mb-6">
              <ShieldCheck size={14} weight="fill" />
              100% Secure Stewardship
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white mb-6 max-w-2xl leading-tight">
              Empower More Children Like Beatrice Today
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
              We publish regular financial reports and impact milestones. Partner with SIO today and
              be certain your generosity drives direct community transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-stretch justify-center">
              <Button
                asChild
                className="rounded-full bg-sio-teal text-sio-navy hover:bg-sio-teal/90 font-bold px-8 py-5 text-base shadow-lg transition-transform hover:scale-105 duration-200"
              >
                <Link href="/donate">Donate Program Funds</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white font-bold px-8 py-5 text-base transition-transform hover:scale-105 duration-200"
              >
                <Link href="/about">View Financial Audits</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
