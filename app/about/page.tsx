"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  Target,
  Eye,
  Heart,
  ShieldCheck,
  GraduationCap,
  Sparkle,
  Handshake,
  User,
  Envelope,
  TwitterLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";

export default function About() {
  // Animation configurations
  const fadeInUp = {
    initial: { opacity: 0, y: 35 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  } as const;

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const;

  const cardHover = {
    hover: {
      y: -6,
      boxShadow: "0 10px 30px -10px rgba(0, 31, 86, 0.15)",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  } as const;

  return (
    <div className="flex flex-col w-full overflow-x-hidden bg-background">
      {/* 1. HERO HEADER */}
      <section className="relative py-20 px-6 lg:px-8 border-b border-border bg-gradient-to-br from-background via-background to-sio-blue/5 text-center">
        <motion.div
          className="mx-auto max-w-4xl"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sio-blue dark:text-sio-teal bg-sio-blue/10 dark:bg-sio-teal/10 px-3 py-1.5 rounded-full mb-6"
          >
            <Handshake size={12} weight="fill" />
            About Slum Impact Organization
          </motion.span>
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Nurturing Hope, Unlocking Potential
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            We believe that no child&apos;s future should be defined by their birthplace. Meet the
            organization committed to bridging the gap for youth living in slums.
          </motion.p>
        </motion.div>
      </section>

      {/* 2. OUR STORY */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Story Content (Left) */}
          <div className="lg:col-span-7 flex flex-col text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-sio-blue dark:text-sio-teal mb-2">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight mb-6">
              How We Started
            </h2>
            <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
              <p>
                Slum Impact Organization (SIO) was founded in response to the deep systemic barriers
                faced by children growing up in dense urban settlements. In these communities,
                access to quality classrooms, nutritious meals, clean water, and safe environments
                is severely restricted, trapping generations in a cycle of poverty.
              </p>
              <p>
                What began as a volunteer-led weekend tutoring program in a makeshift tin-roof
                shelter has blossomed into a full-scale non-governmental organization. Today, SIO
                operates comprehensive support hubs that act as safety nets, learning centers, and
                creative launchpads for hundreds of children every single day.
              </p>
              <p>
                By addressing the children&apos;s physical needs (nutrition and health checks)
                alongside their intellectual and creative needs (education, mentorship, and arts),
                we provide a solid foundation. We empower them to rise, discover their unique
                talents, and create a better path forward for themselves and their communities.
              </p>
            </div>
          </div>

          {/* Story Image (Right) */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-border bg-muted">
              <Image
                src="/images/about_story.jpg"
                alt="Community leaders and volunteers with hopeful children"
                fill
                className="object-cover"
                sizes="(max-w-768px) 100vw, 40vw"
              />
            </div>
            {/* Background Accent Box */}
            <div className="absolute -z-10 -bottom-4 -left-4 w-full h-full rounded-3xl bg-gradient-to-br from-sio-blue/10 to-sio-teal/10 border border-sio-blue/5" />
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION */}
      <section className="py-20 px-6 lg:px-8 bg-muted/20 border-y border-border">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card (Navy) */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-sio-navy text-white rounded-3xl p-8 sm:p-10 lg:p-12 border border-sio-teal/20 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="h-14 w-14 rounded-2xl bg-sio-teal/10 border border-sio-teal/30 flex items-center justify-center text-sio-teal mb-6">
                  <Target size={30} weight="fill" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-4">Our Mission</h3>
                <p className="text-slate-300 leading-relaxed text-base">
                  To empower children living in slum areas through access to quality education,
                  daily nutritional support, basic healthcare services, and creative talent
                  development. We supply the resources, mentorship, and security needed to break the
                  cycles of poverty.
                </p>
              </div>
              <div className="h-[2px] w-20 bg-sio-teal mt-8 rounded-full" />
            </motion.div>

            {/* Vision Card (White/Card) */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-card text-foreground rounded-3xl p-8 sm:p-10 lg:p-12 border border-border shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="h-14 w-14 rounded-2xl bg-sio-blue/10 border border-sio-blue/20 flex items-center justify-center text-sio-blue dark:text-sio-teal mb-6">
                  <Eye size={30} weight="fill" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  We envision a transformed world where every child, regardless of their
                  socio-economic status or geographical background, has the safe environment,
                  developmental opportunities, and support necessary to discover their unique
                  potential and build a bright future.
                </p>
              </div>
              <div className="h-[2px] w-20 bg-sio-blue dark:bg-sio-teal mt-8 rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-sio-blue dark:text-sio-teal">
              Our Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mt-2 mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              These simple, guiding principles keep us aligned and determine how we care for the
              children and run our community hubs daily.
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
                title: "Education First",
                desc: "We believe education is the single most powerful tool for breaking cycles of poverty and empowering the next generation.",
                icon: <GraduationCap size={24} weight="fill" />,
              },
              {
                title: "Child Wellbeing",
                desc: "The physical health, emotional safety, and happiness of the children are placed at the heart of all our decisions.",
                icon: <Heart size={24} weight="fill" />,
              },
              {
                title: "Transparency",
                desc: "We practice full integrity, accountability, and clarity in our financial operations, donor reports, and local programs.",
                icon: <ShieldCheck size={24} weight="fill" />,
              },
              {
                title: "Creative Growth",
                desc: "We foster creativity, providing platforms in arts, sports, and music to allow kids to find their voice and build self-esteem.",
                icon: <Sparkle size={24} weight="fill" />,
              },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover="hover"
                className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between"
                style={{ contentVisibility: "auto" }}
              >
                <div>
                  <div className="h-10 w-10 rounded-xl bg-sio-blue/10 dark:bg-sio-teal/10 text-sio-blue dark:text-sio-teal flex items-center justify-center mb-4">
                    {value.icon}
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-2">{value.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. LEADERSHIP / TEAM */}
      <section className="py-20 px-6 lg:px-8 bg-muted/10 border-t border-border">
        <div className="mx-auto max-w-7xl text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-sio-blue dark:text-sio-teal">
              Who We Are
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mt-2 mb-4">
              The Team Behind SIO
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Meet the community organizers, educators, and pediatricians driving our mission
              forward on the ground.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Tunde Adebayo",
                role: "Executive Director & Founder",
                bio: "A community organizer with over 10 years of experience in youth development and social advocacy in slum settlements.",
              },
              {
                name: "Dr. Chioma Nwachukwu",
                role: "Health & Nutrition Lead",
                bio: "Dedicated pediatrician ensuring every child has access to proper wellness screenings and daily nutritional meals.",
              },
              {
                name: "Emeka Obi",
                role: "Director of Education",
                bio: "Former high school educator passionate about developing active curriculums and mentoring teachers.",
              },
            ].map((member, i) => (
              <motion.div
                key={i}
                variants={cardHover}
                whileHover="hover"
                className="bg-card border border-border p-8 rounded-3xl flex flex-col items-center text-center shadow-sm"
              >
                {/* Modern Avatar Placeholder */}
                <div className="h-20 w-20 rounded-full bg-sio-blue/10 dark:bg-sio-teal/10 border border-border flex items-center justify-center text-sio-blue dark:text-sio-teal mb-6">
                  <User size={36} weight="bold" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-sio-blue dark:text-sio-teal mb-4">
                  {member.role}
                </span>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                  {member.bio}
                </p>

                {/* Social Connects */}
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="p-2 rounded-full border border-border bg-background text-muted-foreground hover:bg-muted hover:text-sio-blue dark:hover:text-sio-teal transition-colors"
                    aria-label="Email"
                  >
                    <Envelope size={16} />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-full border border-border bg-background text-muted-foreground hover:bg-muted hover:text-sio-blue dark:hover:text-sio-teal transition-colors"
                    aria-label="Twitter"
                  >
                    <TwitterLogo size={16} weight="fill" />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-full border border-border bg-background text-muted-foreground hover:bg-muted hover:text-sio-blue dark:hover:text-sio-teal transition-colors"
                    aria-label="LinkedIn"
                  >
                    <LinkedinLogo size={16} weight="fill" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
