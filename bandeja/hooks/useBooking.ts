"use client";

import { useMemo, useState } from "react";
import type { Court, PaymentMethodId, PaymentStep, Venue } from "@/types";

export interface ActiveCourtBooking {
  venue: Venue;
  court: Court;
}

export function useBooking() {
  const [activeBooking, setActiveBooking] = useState<ActiveCourtBooking | null>(null);
  const [step, setStep] = useState<PaymentStep>("details");
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId | null>(null);
  const [bookingCode, setBookingCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const total = useMemo(
    () => (activeBooking ? activeBooking.venue.pricePerHour * duration : 0),
    [activeBooking, duration],
  );

  function openBooking(venue: Venue, court: Court) {
    setActiveBooking({ venue, court });
    setStep("details");
    setSelectedTime("");
    setDuration(1);
    setPaymentMethod(null);
    setBookingCode("");
  }

  function closeBooking() {
    setActiveBooking(null);
  }

  async function confirmPayment(formData: { name: string; phone: string; date: string }) {
    if (!activeBooking || !selectedTime || !paymentMethod) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courtId: activeBooking.court.id,
          date: formData.date,
          startTime: selectedTime,
          duration,
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
    activeBooking,
    bookingCode,
    closeBooking,
    confirmPayment,
    duration,
    isProcessing,
    openBooking,
    paymentMethod,
    selectedTime,
    setDuration,
    setPaymentMethod,
    setSelectedTime,
    setStep,
    step,
    total,
  };
}
