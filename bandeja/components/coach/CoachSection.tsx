"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { Coach } from "@/types";
import { fadeUp, hoverLift, staggerContainer } from "@/lib/animations";
import { cn, formatCurrency } from "@/lib/utils";

interface CoachSectionProps {
  coaches: Coach[];
  onCoachSelect: (coach: Coach) => void;
}

export function CoachSection({ coaches, onCoachSelect }: CoachSectionProps) {
  return (
    <section id="coaches" className="bg-[#111110] px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading label="// 02 - Pelatih Profesional" title={"Temukan\nPelatihmu"} />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {coaches.map((coach) => {
            const Icon = coach.icon;

            return (
              <motion.div key={coach.id} variants={fadeUp} whileHover={hoverLift}>
                <button
                  onClick={() => onCoachSelect(coach)}
                  className="group block w-full overflow-hidden rounded-[4px] border border-neutral-800 bg-[#111110] text-left transition-colors hover:border-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300"
                >
                  <div
                    className={cn(
                      "relative flex aspect-square items-center justify-center overflow-hidden bg-[#1a1a17]",
                      coach.tone === "orange" && "bg-[#1d100d]",
                      coach.tone === "teal" && "bg-[#0a1a1a]",
                      coach.tone === "gold" && "bg-[#1d180c]",
                    )}
                  >
                    <div className="absolute inset-10 rounded-full bg-lime-300/20 blur-3xl group-hover:bg-lime-300/30" />
                    <Icon className="relative h-16 w-16 text-lime-300" aria-hidden="true" />
                  </div>
                  <div className="p-5">
                    <Badge variant={coach.status === "available" ? "lime" : "orange"}>
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
                      {coach.status === "available" ? "Tersedia" : "Sedang Mengajar"}
                    </Badge>
                    <h3 className="mt-4 font-display text-2xl uppercase tracking-[0.06em]">
                      {coach.name}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-500">
                      {coach.specialty} - {coach.experience}
                    </p>
                    <div className="mt-4 font-display text-2xl text-lime-300">
                      {formatCurrency(coach.ratePerSession)}{" "}
                      <span className="font-sans text-xs font-light text-neutral-500">
                        / sesi
                      </span>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
