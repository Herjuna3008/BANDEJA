"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Dumbbell, Star } from "lucide-react";
import type { Coach, CoachVenue, Venue } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { fadeUp, hoverLift, staggerContainer } from "@/lib/animations";
import { formatCurrency } from "@/lib/utils";

type CoachWithRelations = Coach & {
  user: { name: string | null; image: string | null };
  coachVenues: (CoachVenue & { venue: Venue })[];
};

export function CoachesClient({ coaches }: { coaches: CoachWithRelations[] }) {
  const specialties = Array.from(new Set(coaches.map((c) => c.specialty)));
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  const filtered =
    selectedSpecialty === "all"
      ? coaches
      : coaches.filter((c) => c.specialty === selectedSpecialty);

  return (
    <section className="px-5 py-16 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading label="// Pelatih Profesional" title={"Temukan Pelatih\nTerbaikmu"} />

        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedSpecialty === "all" ? "default" : "secondary"}
            onClick={() => setSelectedSpecialty("all")}
          >
            Semua
          </Button>
          {specialties.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={selectedSpecialty === s ? "default" : "secondary"}
              onClick={() => setSelectedSpecialty(s)}
            >
              {s}
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <Card className="p-12 text-center text-neutral-500">
            Belum ada pelatih untuk specialty ini.
          </Card>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {filtered.map((coach) => (
              <motion.div key={coach.id} variants={fadeUp} whileHover={hoverLift}>
                <Link href={`/coaches/${coach.id}`}>
                  <Card className="group relative h-full cursor-pointer overflow-hidden p-6 transition-colors hover:bg-[#1a1a17] before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:origin-left before:scale-x-0 before:bg-lime-300 before:transition-transform hover:before:scale-x-100">
                    {coach.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coach.user.image}
                        alt={coach.user.name ?? "Coach"}
                        className="mb-4 h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-lime-300/10">
                        <Dumbbell className="h-6 w-6 text-lime-300" />
                      </div>
                    )}
                    <h3 className="font-display text-2xl uppercase tracking-[0.06em] text-neutral-100">
                      {coach.user.name}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">{coach.specialty}</p>
                    <p className="mt-0.5 font-mono text-xs text-neutral-600">{coach.experience}</p>

                    <div className="mt-4 flex items-center gap-1 text-xs text-neutral-500">
                      <Star className="h-3.5 w-3.5 text-lime-300" />
                      {coach.coachVenues.length} venue
                    </div>

                    <div className="mt-4 border-t border-neutral-800 pt-4">
                      <span className="font-display text-2xl text-lime-300">
                        {formatCurrency(coach.ratePerSession)}
                      </span>
                      <span className="text-xs text-neutral-600"> / sesi</span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
