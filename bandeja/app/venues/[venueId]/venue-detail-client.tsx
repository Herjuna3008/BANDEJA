"use client";

import { useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Court, Venue } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookingDialog } from "@/components/booking/BookingDialog";
import { useBooking } from "@/hooks/useBooking";
import { cn } from "@/lib/utils";

type VenueWithCourts = Venue & { courts: Court[] };

const toneMap: Record<string, "lime" | "orange" | "teal"> = {
  lime: "lime",
  orange: "orange",
  teal: "teal",
};

interface Props {
  venue: VenueWithCourts;
  userId: string;
}

export function VenueDetailClient({ venue, userId }: Props) {
  const booking = useBooking();
  const tone: "lime" | "orange" | "teal" = toneMap[venue.tone] ?? "lime";

  function handleCourtSelect(court: Court) {
    if (court.status !== "AVAILABLE") return;
    booking.openBooking(
      {
        id: venue.id,
        code: venue.code,
        name: venue.name,
        shortName: venue.shortName,
        area: venue.area,
        district: venue.district,
        pricePerHour: court.pricePerHour,
        tone: (toneMap[venue.tone] ?? "lime") as "lime" | "orange" | "teal",
        courts: venue.courts.map((c) => ({
          id: c.id,
          name: c.name,
          surface: c.surface === "INDOOR" ? "Indoor" : "Outdoor",
          status: c.status === "AVAILABLE" ? "available" : "booked",
        })),
      },
      {
        id: court.id,
        name: court.name,
        surface: court.surface === "INDOOR" ? "Indoor" : "Outdoor",
        status: court.status === "AVAILABLE" ? "available" : "booked",
      },
    );
  }

  return (
    <div className="px-5 py-10 md:px-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/venues"
          className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar venue
        </Link>

        <div className="mb-8">
          <Badge variant={tone}>{venue.code}</Badge>
          <h1 className="mt-4 font-display text-5xl uppercase tracking-[0.06em] text-neutral-100">
            {venue.name}
          </h1>
          <p className="mt-3 flex items-center gap-2 text-neutral-500">
            <MapPin className="h-4 w-4" />
            {venue.area} — {venue.district}
          </p>
        </div>

        <div>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
            // Pilih Court
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {venue.courts.map((court) => (
              <Card key={court.id} className="p-5">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-neutral-100">{court.name}</h3>
                    <p className="text-sm text-neutral-500">{court.surface}</p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase",
                      court.status === "AVAILABLE"
                        ? "bg-lime-300/15 text-lime-300"
                        : "bg-orange-500/15 text-orange-400",
                    )}
                  >
                    {court.status === "AVAILABLE" ? "Tersedia" : "Maintenance"}
                  </span>
                </div>
                <div className="mb-4 text-sm text-neutral-500">
                  <span className="font-display text-2xl text-lime-300">
                    Rp {court.pricePerHour.toLocaleString("id-ID")}
                  </span>
                  {" "}/ jam
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={court.status !== "AVAILABLE"}
                  onClick={() => handleCourtSelect(court)}
                >
                  {court.status === "AVAILABLE" ? "Book Court Ini" : "Tidak Tersedia"}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BookingDialog
        booking={booking.activeBooking}
        bookingCode={booking.bookingCode}
        duration={booking.duration}
        isProcessing={booking.isProcessing}
        paymentMethod={booking.paymentMethod}
        selectedTime={booking.selectedTime}
        step={booking.step}
        total={booking.total}
        onClose={booking.closeBooking}
        onConfirmPayment={async () => {
          await booking.confirmPayment();
          if (booking.bookingCode) {
            toast.success(`Booking berhasil! Kode: ${booking.bookingCode}`);
          }
        }}
        onDurationChange={booking.setDuration}
        onPaymentMethodChange={booking.setPaymentMethod}
        onStepChange={booking.setStep}
        onTimeChange={booking.setSelectedTime}
      />
    </div>
  );
}
