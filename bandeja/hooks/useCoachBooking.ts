"use client";

import { useMemo, useState } from "react";
import type { Coach, PaymentMethodId, PaymentStep } from "@/types";
import { generateBookingCode } from "@/lib/utils";

export function useCoachBooking() {
  const [activeCoach, setActiveCoach] = useState<Coach | null>(null);
  const [step, setStep] = useState<PaymentStep>("details");
  const [sessions, setSessions] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId | null>(null);
  const [bookingCode, setBookingCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const total = useMemo(
    () => (activeCoach ? activeCoach.ratePerSession * sessions : 0),
    [activeCoach, sessions],
  );

  function openCoachBooking(coach: Coach) {
    setActiveCoach(coach);
    setStep("details");
    setSessions(1);
    setPaymentMethod(null);
    setBookingCode("");
  }

  function closeCoachBooking() {
    setActiveCoach(null);
  }

  async function confirmPayment() {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    setBookingCode(generateBookingCode("BDJ-C"));
    setStep("success");
    setIsProcessing(false);
  }

  return {
    activeCoach,
    bookingCode,
    closeCoachBooking,
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
