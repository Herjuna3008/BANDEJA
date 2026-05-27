"use client";

import { Lock, Zap, Swords, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fadeUp, staggerContainer } from "@/lib/animations";

const features = [
  {
    icon: Zap,
    title: "Booking Lapangan",
    desc: "Pilih venue, court, dan jadwal favoritmu. Bayar langsung lewat platform.",
    preview: ["Court A1 · Indoor", "Court A2 · Indoor", "Court B1 · Outdoor"],
  },
  {
    icon: Users,
    title: "Temukan Pelatih",
    desc: "8 pelatih profesional siap bantu game kamu naik level.",
    preview: ["Rafa Santana · Teknik & Rally", "Lisa Chen · Footwork", "Andre Putra · Strategi"],
  },
  {
    icon: Swords,
    title: "Cari Lawan Tanding",
    desc: "Post tantangan atau auto-match dengan lawan sesuai level kamu.",
    preview: ["Beginner · 3 orang menunggu", "Intermediate · 5 orang menunggu", "Advanced · 2 orang menunggu"],
  },
];

export function LandingPreviewOverlay() {
  return (
    <section className="px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 md:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={fadeUp}>
                <Card className="relative overflow-hidden p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-[4px] border border-lime-300/20 bg-lime-300/10 p-2">
                      <Icon className="h-5 w-5 text-lime-300" />
                    </div>
                    <h3 className="font-display text-xl uppercase tracking-[0.06em]">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mb-5 text-sm text-neutral-500">{feature.desc}</p>

                  <div className="relative">
                    <div className="space-y-2 blur-sm select-none">
                      {feature.preview.map((item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between rounded-[4px] border border-neutral-800 px-3 py-2 text-sm"
                        >
                          <span className="text-neutral-400">{item}</span>
                          <span className="h-2 w-2 rounded-full bg-lime-300" />
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2 rounded-[4px] border border-neutral-700 bg-[#0a0a08]/90 px-4 py-3 backdrop-blur-sm">
                        <Lock className="h-4 w-4 text-neutral-400" />
                        <span className="text-xs text-neutral-400">Login untuk akses</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Button asChild size="lg">
            <Link href="/login">
              <Zap className="h-4 w-4" />
              Mulai Sekarang — Gratis
            </Link>
          </Button>
          <p className="mt-3 text-sm text-neutral-600">Login dengan Google, langsung main.</p>
        </motion.div>
      </div>
    </section>
  );
}
