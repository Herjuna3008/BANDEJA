"use client";

import { ArrowLeft, Dumbbell, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import type { Coach, CoachVenue, Venue } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CoachBookingDialog } from "@/components/coach/CoachBookingDialog";
import { useCoachBooking } from "@/hooks/useCoachBooking";
import { formatCurrency } from "@/lib/utils";

type CoachWithRelations = Coach & {
  user: { name: string | null; image: string | null; email: string | null };
  coachVenues: (CoachVenue & { venue: Venue })[];
};

interface Props {
  coach: CoachWithRelations;
}

export function CoachDetailClient({ coach }: Props) {
  const coachBooking = useCoachBooking();

  function handleBook() {
    coachBooking.openCoachBooking(
      {
        id: coach.id,
        name: coach.user.name ?? "Coach",
        specialty: coach.specialty,
        experience: coach.experience,
        ratePerSession: coach.ratePerSession,
        status: "available",
        tone: "lime",
        icon: Dumbbell,
      },
      coach.coachVenues.map((cv) => ({ id: cv.venue.id, name: cv.venue.name })),
    );
  }

  return (
    <div className="px-5 py-10 md:px-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/coaches"
          className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar pelatih
        </Link>

        <div className="grid gap-8 md:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center gap-4 md:items-start">
            {coach.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coach.user.image}
                alt={coach.user.name ?? "Coach"}
                className="h-28 w-28 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-lime-300/10">
                <Dumbbell className="h-12 w-12 text-lime-300" />
              </div>
            )}
          </div>

          <div>
            <h1 className="font-display text-5xl uppercase tracking-[0.06em] text-neutral-100">
              {coach.user.name}
            </h1>
            <p className="mt-2 text-lg text-neutral-400">{coach.specialty}</p>
            <p className="mt-1 flex items-center gap-2 font-mono text-sm text-neutral-600">
              <Clock className="h-4 w-4" />
              {coach.experience}
            </p>

            {coach.bio && (
              <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-500">{coach.bio}</p>
            )}

            <div className="mt-6">
              <span className="font-display text-4xl text-lime-300">
                {formatCurrency(coach.ratePerSession)}
              </span>
              <span className="text-sm text-neutral-500"> / sesi</span>
            </div>

            <Button className="mt-6" onClick={handleBook}>
              Book Sesi dengan {coach.user.name?.split(" ")[0]}
            </Button>
          </div>
        </div>

        {coach.coachVenues.length > 0 && (
          <div className="mt-12">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
              // Venue Tersedia
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {coach.coachVenues.map(({ venue }) => (
                <Card key={venue.id} className="flex items-center gap-3 p-4">
                  <MapPin className="h-4 w-4 shrink-0 text-lime-300" />
                  <div>
                    <p className="font-medium text-neutral-200">{venue.name}</p>
                    <p className="text-xs text-neutral-500">
                      {venue.area} — {venue.district}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <CoachBookingDialog
        bookingCode={coachBooking.bookingCode}
        coach={coachBooking.activeCoach}
        isProcessing={coachBooking.isProcessing}
        paymentMethod={coachBooking.paymentMethod}
        sessions={coachBooking.sessions}
        step={coachBooking.step}
        total={coachBooking.total}
        onClose={coachBooking.closeCoachBooking}
        coachVenues={coachBooking.coachVenues}
        onConfirmPayment={coachBooking.confirmPayment}
        onPaymentMethodChange={coachBooking.setPaymentMethod}
        onSessionsChange={coachBooking.setSessions}
        onStepChange={coachBooking.setStep}
      />
    </div>
  );
}
