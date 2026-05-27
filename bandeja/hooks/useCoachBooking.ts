"use client";

import { useMemo, useState } from "react";
import type { Coach, PaymentMethodId, PaymentStep } from "@/types";
import type { CoachBookingFormValues } from "@/lib/validations";

export function useCoachBooking() {
  const [activeCoach, setActiveCoach] = useState<Coach | null>(null);
  const [coachVenues, setCoachVenues] = useState<{ id: string; name: string }[]>([]);
  const [step, setStep] = useState<PaymentStep>("details");
  const [sessions, setSessions] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId | null>(null);
  const [bookingCode, setBookingCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const total = useMemo(
    () => (activeCoach ? activeCoach.ratePerSession * sessions : 0),
    [activeCoach, sessions],
  );

  function openCoachBooking(coach: Coach, venues: { id: string; name: string }[]) {
    setActiveCoach(coach);
    setCoachVenues(venues);
    setStep("details");
    setSessions(1);
    setPaymentMethod(null);
    setBookingCode("");
  }

  function closeCoachBooking() {
    setActiveCoach(null);
  }

  async function confirmPayment(formData: CoachBookingFormValues) {
    if (!activeCoach || !paymentMethod) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/coach-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coachId: activeCoach.id,
          venueId: formData.venue,
          date: formData.date,
          time: formData.time,
          sessions,
          totalPrice: total,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Booking gagal");
      }
      setBookingCode(data.bookingCode);
      setStep("success");
    } finally {
      setIsProcessing(false);
    }
  }

  return {
    activeCoach,
    bookingCode,
    closeCoachBooking,
    coachVenues,
    confirmPayment,
    isProcessing,
    openCoachBooking,
    paymentMethod,
    sessions,
    setPaymentMethod,
    setSessions,
    setStep,
    step,
    total,
  };
}
