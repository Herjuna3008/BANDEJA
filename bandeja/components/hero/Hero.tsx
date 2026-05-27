"use client";

import { Swords, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from 'next/image'
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations";

const stats = [
  { value: "3", label: "Venue Aktif" },
  { value: "12", label: "Lapangan" },
  { value: "8", label: "Pelatih Pro" },
];

interface HeroProps {
  isLoggedIn?: boolean;
}

export function Hero({ isLoggedIn }: HeroProps) {
  const bookHref = isLoggedIn ? "/venues" : "/login";
  const matchHref = isLoggedIn ? "/matchmaking" : "/login";

  return (
    <section
      id="top"
      className="relative flex min-h-dvh overflow-hidden px-5 pb-16 pt-32 md:px-12 md:pb-20"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a0a08_0%,#0d1a0a_50%,#0a0a08_100%)]" />
      <div className="grid-element">
        <Image
          fill
          src="/bg-padel.jpeg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt="Background image of people playing padel"
        />
      </div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex w-full max-w-7xl items-end justify-between"
      >
        <div>
          <motion.div
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-300 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-lime-300"
          >
            <Zap className="h-3.5 w-3.5" />
            Platform Padel #1 Indonesia
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="font-display text-[clamp(5rem,16vw,12.5rem)] uppercase leading-[0.88] tracking-normal text-neutral-100"
          >
            BAN<span className="text-lime-300">DEJA</span>
            <br />
            PADEL.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg font-light leading-8 text-neutral-500"
          >
            Book lapangan, temukan pelatih terbaik, dan tantang lawan baru. Semua dalam
            satu platform.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href={bookHref}>
                <Zap className="h-4 w-4" />
                Book Lapangan
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={matchHref}>
                <Swords className="h-4 w-4" />
                Cari Lawan
              </Link>
            </Button>
          </motion.div>
        </div>
        <motion.div variants={fadeUp} className="hidden flex-col gap-6 text-right lg:flex">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-5xl leading-none text-lime-300">
                {stat.value}
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
