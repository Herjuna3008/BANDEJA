"use client";

import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { Court, Venue, VenueTone } from "@/types";
import { fadeUp, hoverLift, staggerContainer } from "@/lib/animations";
import { cn, formatCurrency } from "@/lib/utils";

const toneToBadge: Record<VenueTone, "lime" | "orange" | "teal"> = {
  lime: "lime",
  orange: "orange",
  teal: "teal",
};

interface VenueSectionProps {
  venues: Venue[];
  onCourtSelect: (venue: Venue, court: Court) => void;
  onVenueInspect: (venue: Venue) => void;
}

export function VenueSection({ onCourtSelect, onVenueInspect, venues }: VenueSectionProps) {
  return (
    <section id="venues" className="px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading label="// 01 - Venue & Lapangan" title={"Pilih Venue\nFavoritmu"} />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="grid gap-1 md:grid-cols-3"
        >
          {venues.map((venue) => (
            <motion.div key={venue.id} variants={fadeUp} whileHover={hoverLift}>
              <Card
                role="button"
                tabIndex={0}
                onClick={() => onVenueInspect(venue)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") onVenueInspect(venue);
                }}
                className={cn(
                  "group relative h-full overflow-hidden p-8 outline-none transition-colors hover:bg-[#1a1a17] focus-visible:ring-2 focus-visible:ring-lime-300",
                  "before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:origin-left before:scale-x-0 before:bg-lime-300 before:transition-transform hover:before:scale-x-100",
                )}
                aria-label={`Lihat venue ${venue.name}`}
              >
                <Badge variant={toneToBadge[venue.tone]}>{venue.code}</Badge>
                <h3 className="mt-5 font-display text-4xl uppercase tracking-[0.08em]">
                  {venue.name}
                </h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
                  <MapPin className="h-4 w-4" />
                  {venue.area} - {venue.district}
                </p>
                <div className="my-7 grid gap-2">
                  {venue.courts.map((court) => (
                    <button
                      key={court.id}
                      type="button"
                      disabled={court.status === "booked"}
                      onClick={(event) => {
                        event.stopPropagation();
                        onCourtSelect(venue, court);
                      }}
                      className="flex items-center justify-between rounded-[4px] border border-neutral-800 bg-[#0a0a08] px-3.5 py-2.5 text-left text-sm transition-colors hover:border-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <span className="font-medium">
                        {court.name} - {court.surface}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase",
                          court.status === "available"
                            ? "bg-lime-300/15 text-lime-300"
                            : "bg-orange-500/15 text-orange-400",
                        )}
                      >
                        {court.status === "available" ? "Tersedia" : "Penuh"}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="font-display text-3xl text-lime-300">
                  {formatCurrency(venue.pricePerHour)}{" "}
                  <span className="font-sans text-sm font-light text-neutral-500">/ jam</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
