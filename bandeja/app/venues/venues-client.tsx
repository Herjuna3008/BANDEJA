"use client";

import { useState } from "react";
import { MapPin, Filter } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Court, Venue } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { fadeUp, hoverLift, staggerContainer } from "@/lib/animations";
import { formatCurrency, cn } from "@/lib/utils";

type VenueWithCourts = Venue & { courts: Court[] };

const toneMap: Record<string, "lime" | "orange" | "teal"> = {
  lime: "lime",
  orange: "orange",
  teal: "teal",
};

export function VenuesClient({ venues }: { venues: VenueWithCourts[] }) {
  const areas = Array.from(new Set(venues.map((v) => v.area)));
  const [selectedArea, setSelectedArea] = useState<string>("all");

  const filtered =
    selectedArea === "all" ? venues : venues.filter((v) => v.area === selectedArea);

  return (
    <section className="px-5 py-16 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading label="// Venue & Lapangan" title={"Pilih Venue\nFavoritmu"} />

        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-500" />
          <Button
            size="sm"
            variant={selectedArea === "all" ? "default" : "secondary"}
            onClick={() => setSelectedArea("all")}
          >
            Semua Area
          </Button>
          {areas.map((area) => (
            <Button
              key={area}
              size="sm"
              variant={selectedArea === area ? "default" : "secondary"}
              onClick={() => setSelectedArea(area)}
            >
              {area}
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <Card className="p-12 text-center text-neutral-500">
            Belum ada venue tersedia untuk area ini.
          </Card>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-1 md:grid-cols-3"
          >
            {filtered.map((venue) => {
              const available = venue.courts.filter((c) => c.status === "AVAILABLE").length;
              const tone = toneMap[venue.tone] ?? "lime";
              return (
                <motion.div key={venue.id} variants={fadeUp} whileHover={hoverLift}>
                  <Link href={`/venues/${venue.id}`}>
                    <Card className="group relative h-full overflow-hidden p-8 transition-colors hover:bg-[#1a1a17] cursor-pointer before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:origin-left before:scale-x-0 before:bg-lime-300 before:transition-transform hover:before:scale-x-100">
                      <Badge variant={tone}>{venue.code}</Badge>
                      <h3 className="mt-5 font-display text-4xl uppercase tracking-[0.08em]">
                        {venue.name}
                      </h3>
                      <p className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
                        <MapPin className="h-4 w-4" />
                        {venue.area} — {venue.district}
                      </p>
                      <div className="my-7 grid gap-2">
                        {venue.courts.slice(0, 4).map((court) => (
                          <div
                            key={court.id}
                            className="flex items-center justify-between rounded-[4px] border border-neutral-800 bg-[#0a0a08] px-3.5 py-2.5 text-sm"
                          >
                            <span className="font-medium">{court.name} · {court.surface}</span>
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase",
                                court.status === "AVAILABLE"
                                  ? "bg-lime-300/15 text-lime-300"
                                  : "bg-orange-500/15 text-orange-400",
                              )}
                            >
                              {court.status === "AVAILABLE" ? "Tersedia" : "Maintenance"}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs text-neutral-600">
                            {available} court tersedia
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
