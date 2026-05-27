"use client";

import { coaches } from "@/data/coaches";
import { venues } from "@/data/venues";
import { BookingDialog } from "@/components/booking/BookingDialog";
import { CoachBookingDialog } from "@/components/coach/CoachBookingDialog";
import { CoachSection } from "@/components/coach/CoachSection";
import { Hero } from "@/components/hero/Hero";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MatchmakingSection } from "@/components/matchmaking/MatchmakingSection";
import { VenueSection } from "@/components/venue/VenueSection";
import { useBooking } from "@/hooks/useBooking";
import { useCoachBooking } from "@/hooks/useCoachBooking";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { useToast } from "@/hooks/useToast";
import type { AutoMatchFormValues, MatchPostFormValues } from "@/lib/validations";

export function BandejaApp() {
  const toast = useToast();
  const booking = useBooking();
  const coachBooking = useCoachBooking();
  const matchmaking = useMatchmaking();

  function handlePostChallenge(values: MatchPostFormValues) {
    const post = matchmaking.postChallenge(values);
    toast.success(`Tantangan ${post.player} berhasil dipost`);
  }

  async function handleAutoMatch(values: AutoMatchFormValues) {
    const match = await matchmaking.autoMatch(values.name, values.level);
    toast.success(`Match ditemukan: ${match}`);
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <VenueSection
          venues={venues}
          onVenueInspect={(venue) =>
            toast.info(`${venue.name} - pilih court tersedia untuk booking`)
          }
          onCourtSelect={(venue, court) => booking.openBooking(venue, court)}
        />
        <CoachSection coaches={coaches} onCoachSelect={(coach) => coachBooking.openCoachBooking(coach, [])} />
        <MatchmakingSection
          filter={matchmaking.filter}
          isFinding={matchmaking.isFinding}
          posts={matchmaking.filteredPosts}
          onAcceptChallenge={(name) =>
            toast.success(`Tantangan terkirim ke ${name}. Tunggu konfirmasi.`)
          }
          onAutoMatch={handleAutoMatch}
          onFilterChange={matchmaking.setFilter}
          onPostChallenge={handlePostChallenge}
        />
      </main>
      <Footer />

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
        onConfirmPayment={async (formValues) => { await booking.confirmPayment(formValues); }}
        onDurationChange={booking.setDuration}
        onPaymentMethodChange={booking.setPaymentMethod}
        onStepChange={booking.setStep}
        onTimeChange={booking.setSelectedTime}
      />

      <CoachBookingDialog
        bookingCode={coachBooking.bookingCode}
        coach={coachBooking.activeCoach}
        coachVenues={coachBooking.coachVenues}
        isProcessing={coachBooking.isProcessing}
        paymentMethod={coachBooking.paymentMethod}
        sessions={coachBooking.sessions}
        step={coachBooking.step}
        total={coachBooking.total}
        onClose={coachBooking.closeCoachBooking}
        onConfirmPayment={coachBooking.confirmPayment}
        onPaymentMethodChange={coachBooking.setPaymentMethod}
        onSessionsChange={coachBooking.setSessions}
        onStepChange={coachBooking.setStep}
      />
    </>
  );
}
