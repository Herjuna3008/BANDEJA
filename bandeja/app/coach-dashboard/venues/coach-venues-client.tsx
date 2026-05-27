"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import type { Venue } from "@prisma/client";
import { Card } from "@/components/ui/card";

type VenueWithAvailability = Venue & { isAvailable: boolean };

export function CoachVenuesClient({ venues: initial }: { venues: VenueWithAvailability[] }) {
  const [venues, setVenues] = useState(initial);

  async function toggleVenue(venueId: string, current: boolean) {
    try {
      const res = await fetch("/api/coach-dashboard/venues", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueId, available: !current }),
      });
      if (!res.ok) throw new Error();
      setVenues((prev) =>
        prev.map((v) => (v.id === venueId ? { ...v, isAvailable: !current } : v)),
      );
      toast.success(!current ? "Venue diaktifkan." : "Venue dinonaktifkan.");
    } catch {
      toast.error("Gagal mengubah venue.");
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {venues.map((venue) => (
        <button
          key={venue.id}
          type="button"
          onClick={() => toggleVenue(venue.id, venue.isAvailable)}
          className={`rounded-[4px] border p-5 text-left transition-all ${
            venue.isAvailable
              ? "border-lime-300/30 bg-lime-300/5"
              : "border-neutral-800 hover:border-neutral-600"
          }`}
        >
          <div className="mb-1 flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                venue.isAvailable ? "bg-lime-300" : "bg-neutral-600"
              }`}
            />
            <span className={`text-sm font-bold ${venue.isAvailable ? "text-lime-300" : "text-neutral-400"}`}>
              {venue.isAvailable ? "Aktif" : "Nonaktif"}
            </span>
          </div>
          <h4 className="font-display text-xl uppercase tracking-[0.06em] text-neutral-100">
            {venue.name}
          </h4>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
            <MapPin className="h-3 w-3" />
            {venue.area} — {venue.district}
          </p>
        </button>
      ))}
    </div>
  );
}
