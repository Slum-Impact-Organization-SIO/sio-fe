"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  HandHeart,
  GraduationCap,
  ForkKnife,
  Sparkle,
  ArrowRight,
  CheckCircle,
  Calendar,
  Plus,
  Minus,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

// Styled custom FAQ Collapsible Item
function FAQItem({ id, question, answer }: { id: string; question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
        isOpen
          ? "border-sio-blue bg-sio-blue/[0.02] dark:border-sio-teal dark:bg-sio-teal/[0.02] shadow-sm"
          : "border-border bg-card hover:border-sio-blue/20 dark:hover:border-sio-teal/20"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left p-5 sm:p-6 text-base font-bold text-foreground transition-colors group cursor-pointer"
      >
        <div className="flex items-start gap-4 pr-4">
          <span
            className={`font-mono text-sm font-semibold transition-colors mt-0.5 ${
              isOpen ? "text-sio-blue dark:text-sio-teal" : "text-muted-foreground"
            }`}
          >
            {id}
          </span>
          <span>{question}</span>
        </div>
        <div
          className={`h-8 w-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
            isOpen
              ? "border-sio-blue bg-sio-blue text-white dark:border-sio-teal dark:bg-sio-teal dark:text-sio-navy"
              : "border-border bg-muted text-muted-foreground group-hover:border-sio-blue/30 group-hover:text-sio-blue dark:group-hover:border-sio-teal/30 dark:group-hover:text-sio-teal"
          }`}
        >
          {isOpen ? <Minus size={14} weight="bold" /> : <Plus size={14} weight="bold" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pl-14 text-sm text-muted-foreground leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Volunteer() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "academic",
    availability: "flexible",
    motivation: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.phone) {
      setSubmitted(true);
    }
  };

  // Animation presets
  const fadeInUp = {
    initial: { opacity: 0, y: 35 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  } as const;

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15,
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
            <HandHeart size={12} weight="fill" />
            Make a Direct Difference
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Join Our Volunteer Family
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Give your time, share your unique skills, and build a brighter pathway for children
            living in slum communities.
          </motion.p>
        </div>
      </section>

      {/* 2. ROLES GRID */}
      <section className="py-20 px-6 lg:px-8 bg-muted/10 border-b border-border">
        <div className="mx-auto max-w-7xl text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-sio-blue dark:text-sio-teal">
              Opportunities
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mt-2 mb-4">
              Where We Need You
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We have diverse roles tailored to different skills, schedules, and interests. Join one
              of our primary programs.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Academic Tutoring",
                desc: "Help children with reading, math, and homework during our weekend classes at the hub.",
                icon: <GraduationCap size={24} weight="fill" />,
              },
              {
                title: "Nutrition Support",
                desc: "Assist our kitchen teams in preparing and serving daily hot, healthy meals to the children.",
                icon: <ForkKnife size={24} weight="fill" />,
              },
              {
                title: "Talent Mentorship",
                desc: "Guide youth in sports coaching, painting, music, crafts, or dance at our creative hubs.",
                icon: <Sparkle size={24} weight="fill" />,
              },
              {
                title: "Outreach & Media",
                desc: "Help SIO document stories, manage event logistics, run photography, or assist with grant writing.",
                icon: <Calendar size={24} weight="fill" />,
              },
            ].map((role, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="h-10 w-10 rounded-xl bg-sio-blue/10 dark:bg-sio-teal/10 text-sio-blue dark:text-sio-teal flex items-center justify-center mb-4">
                    {role.icon}
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-2">{role.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{role.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. STORY & APPLICATION FORM */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Visual Panel (Left) */}
          <div className="lg:col-span-5 relative flex flex-col justify-between bg-sio-navy text-white rounded-3xl p-8 sm:p-10 border border-sio-teal/20 shadow-xl overflow-hidden min-h-[400px]">
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/volunteer_hero.jpg"
                alt="Volunteer helping children learn"
                fill
                className="object-cover opacity-20"
                sizes="(max-w-768px) 100vw, 40vw"
              />
            </div>
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-sio-teal bg-white/10 px-3 py-1 rounded-full">
                SIO Community
              </span>
              <h3 className="text-3xl font-serif font-bold text-white mt-6 mb-4 leading-tight">
                Together, We Go Further
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Our volunteers are the heartbeat of Slum Impact Organization. By volunteering, you
                contribute to a structural safety net that helps local youth bypass poverty and find
                positive expressions.
              </p>
            </div>
            <div className="relative z-10 border-t border-white/15 pt-6 flex flex-col gap-2 text-xs text-slate-400 text-left">
              <p>📍 Operating Hubs in Lagos, Nigeria</p>
              <p>⏱️ Flexible weekly time commitments</p>
            </div>
          </div>

          {/* Form Panel (Right) */}
          <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-md">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <h3 className="text-2xl font-serif font-bold text-foreground">
                  Volunteer Application
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fill in your details below, and our community outreach team will get back to you
                  within 48 hours.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tunde Balogun"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-sio-blue focus:outline-none focus:ring-1 focus:ring-sio-blue dark:focus:border-sio-teal dark:focus:ring-sio-teal"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +234 801 234 5678"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-sio-blue focus:outline-none focus:ring-1 focus:ring-sio-blue dark:focus:border-sio-teal dark:focus:ring-sio-teal"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. tunde@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-sio-blue focus:outline-none focus:ring-1 focus:ring-sio-blue dark:focus:border-sio-teal dark:focus:ring-sio-teal"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Primary Program Interest
                    </label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-sio-blue focus:outline-none focus:ring-1 focus:ring-sio-blue dark:focus:border-sio-teal dark:focus:ring-sio-teal"
                    >
                      <option value="academic">Academic Support & Tutoring</option>
                      <option value="nutrition">Feeding Program & Logistics</option>
                      <option value="creative">Talent & Sports Mentorship</option>
                      <option value="operations">Operations, Media & Admin</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Availability
                    </label>
                    <select
                      value={form.availability}
                      onChange={(e) => setForm({ ...form, availability: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-sio-blue focus:outline-none focus:ring-1 focus:ring-sio-blue dark:focus:border-sio-teal dark:focus:ring-sio-teal"
                    >
                      <option value="weekdays">Weekdays (Mon - Fri)</option>
                      <option value="weekends">Weekends (Sat - Sun)</option>
                      <option value="flexible">Flexible / Remote Support</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Why do you want to volunteer? (Brief)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us a little bit about yourself and why you'd like to join hands with SIO..."
                    value={form.motivation}
                    onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-sio-blue focus:outline-none focus:ring-1 focus:ring-sio-blue dark:focus:border-sio-teal dark:focus:ring-sio-teal"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-lg bg-sio-blue hover:bg-sio-blue/90 text-white dark:bg-sio-teal dark:text-sio-navy dark:hover:bg-sio-teal/90 py-6 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Submit Application
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
                <h3 className="text-2xl font-serif font-bold text-foreground mb-3">
                  Application Received!
                </h3>
                <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-6">
                  Thank you, <span className="font-bold text-foreground">{form.name}</span>, for
                  offering to join SIO. We have sent a verification email to{" "}
                  <span className="font-bold text-foreground">{form.email}</span>. Our volunteer
                  coordinators will review your details and connect with you shortly.
                </p>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      role: "academic",
                      availability: "flexible",
                      motivation: "",
                    });
                  }}
                  variant="outline"
                  className="rounded-full border-border bg-background hover:bg-muted font-bold px-6 py-2.5 text-sm"
                >
                  Submit Another Form
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 4. FAQ ACCORDION SECTION */}
      <section className="py-20 px-6 lg:px-8 bg-muted/20 border-t border-border">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-sio-blue dark:text-sio-teal">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight mt-2">
              Volunteer FAQs
            </h2>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                id: "01",
                q: "What is the minimum time commitment?",
                a: "We are highly flexible! Academic tutors generally spend 2-4 hours on Saturdays at our hub, while health and kitchen volunteers assist during lunchtime feeding blocks. We also support remote options for operations.",
              },
              {
                id: "02",
                q: "Do I need specific qualifications or background checks?",
                a: "You do not need formal teaching qualifications. However, because we work directly with vulnerable children, all successful applicants must undergo a basic background verification check and attend our mandatory child safeguarding induction.",
              },
              {
                id: "03",
                q: "Can I volunteer remotely?",
                a: "Yes! SIO relies on volunteer support in digital operations, graphic design, writing grant proposals, translation, and media editing. If you wish to support remotely, select 'Flexible / Remote Support' as your availability.",
              },
              {
                id: "04",
                q: "Where exactly are the volunteer hubs located?",
                a: "Our primary centers are located in the high-need communities within Lagos, Nigeria. When your application is approved, our coordinators will assign you to the nearest hub closest to your location.",
              },
            ].map((faq, index) => (
              <FAQItem key={index} id={faq.id} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
