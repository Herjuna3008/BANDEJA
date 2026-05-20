"use client";

import { useMemo, useState } from "react";
import type { Court, PaymentMethodId, PaymentStep, Venue } from "@/types";
import { generateBookingCode } from "@/lib/utils";

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

  async function confirmPayment() {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    setBookingCode(generateBookingCode());
    setStep("success");
    setIsProcessing(false);
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
