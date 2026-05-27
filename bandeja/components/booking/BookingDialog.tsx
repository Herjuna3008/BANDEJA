"use client";

import { useEffect } from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trophy } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentMethodGrid } from "@/components/shared/PaymentMethodGrid";
import { PaymentSteps } from "@/components/shared/PaymentSteps";
import { QrisDialog } from "@/components/shared/QrisDialog";
import { FormField } from "@/components/shared/FormField";
import { timeSlots } from "@/constants/site";
import type { ActiveCourtBooking } from "@/hooks/useBooking";
import type { PaymentMethodId, PaymentStep } from "@/types";
import { bookingSchema, type BookingFormValues } from "@/lib/validations";
import { cn, formatCurrency } from "@/lib/utils";

interface BookingDialogProps {
  booking: ActiveCourtBooking | null;
  bookingCode: string;
  duration: number;
  isProcessing: boolean;
  paymentMethod: PaymentMethodId | null;
  selectedTime: string;
  step: PaymentStep;
  total: number;
  onClose: () => void;
  onConfirmPayment: () => void;
  onDurationChange: (duration: number) => void;
  onPaymentMethodChange: (method: PaymentMethodId) => void;
  onStepChange: (step: PaymentStep) => void;
  onTimeChange: (time: string) => void;
}

export function BookingDialog({
  booking,
  bookingCode,
  duration,
  isProcessing,
  onClose,
  onConfirmPayment,
  onDurationChange,
  onPaymentMethodChange,
  onStepChange,
  onTimeChange,
  paymentMethod,
  selectedTime,
  step,
  total,
}: BookingDialogProps) {
  const [qrisOpen, setQrisOpen] = useState(false);
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { name: "", phone: "", date: "", duration: 1 },
  });

  useEffect(() => {
    form.setValue("duration", duration);
  }, [duration, form]);

  if (!booking) return null;

  const { court, venue } = booking;

  function handleDetailsSubmit() {
    if (!selectedTime) {
      form.setError("root", { message: "Pilih jam booking dulu" });
      return;
    }
    form.clearErrors("root");
    onStepChange("payment");
  }

  function handlePaymentSubmit() {
    if (!paymentMethod) {
      form.setError("root", { message: "Pilih metode pembayaran" });
      return;
    }
    form.clearErrors("root");
    onConfirmPayment();
  }

  return (
    <Dialog open={Boolean(booking)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Court {court.id}</DialogTitle>
          <DialogDescription>
            {court.name} - {venue.name}
          </DialogDescription>
        </DialogHeader>

        <div className="px-8 py-7">
          <PaymentSteps current={step} />

          {step === "details" ? (
            <form className="grid gap-5" onSubmit={form.handleSubmit(handleDetailsSubmit)}>
              <FormField label="Nama Pemesan" error={form.formState.errors.name?.message}>
                <Input placeholder="Masukkan nama lengkap" {...form.register("name")} />
              </FormField>
              <FormField label="Nomor HP" error={form.formState.errors.phone?.message}>
                <Input placeholder="08xx-xxxx-xxxx" type="tel" {...form.register("phone")} />
              </FormField>
              <FormField label="Tanggal" error={form.formState.errors.date?.message}>
                <Input type="date" {...form.register("date")} />
              </FormField>
              <FormField label="Pilih Jam">
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={slot.taken}
                      onClick={() => onTimeChange(slot.time)}
                      className={cn(
                        "rounded-[4px] border border-neutral-800 bg-[#0a0a08] px-2 py-2.5 font-mono text-xs text-neutral-500 transition-colors hover:border-lime-300 hover:text-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 disabled:cursor-not-allowed disabled:opacity-30",
                        selectedTime === slot.time &&
                          "border-lime-300 bg-lime-300 font-bold text-neutral-950 hover:text-neutral-950",
                      )}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </FormField>
              <FormField label="Durasi" error={form.formState.errors.duration?.message}>
                <Select
                  value={String(duration)}
                  onValueChange={(value) => onDurationChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih durasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Jam</SelectItem>
                    <SelectItem value="2">2 Jam</SelectItem>
                    <SelectItem value="3">3 Jam</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <BookingSummary
                rows={[
                  ["Court", `${court.name} - ${venue.shortName}`],
                  ["Durasi", `${duration} Jam`],
                  ["Harga/jam", formatCurrency(venue.pricePerHour)],
                  ["Total", formatCurrency(total)],
                ]}
              />
              {form.formState.errors.root?.message ? (
                <p className="text-sm text-orange-400">{form.formState.errors.root.message}</p>
              ) : null}
              <Button type="submit">Lanjut ke Pembayaran</Button>
            </form>
          ) : null}

          {step === "payment" ? (
            <div className="grid gap-5">
              <BookingSummary rows={[["Total Pembayaran", formatCurrency(total)]]} />
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                  Pilih Metode Pembayaran
                </p>
                <PaymentMethodGrid
                  selected={paymentMethod}
                  onSelect={onPaymentMethodChange}
                  onQrisOpen={() => setQrisOpen(true)}
                />
              </div>
              {form.formState.errors.root?.message ? (
                <p className="text-sm text-orange-400">{form.formState.errors.root.message}</p>
              ) : null}
              <Button onClick={handlePaymentSubmit} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Konfirmasi Pembayaran
              </Button>
            </div>
          ) : null}

          {step === "success" ? (
            <div className="py-3 text-center">
              <Trophy className="mx-auto mb-5 h-16 w-16 text-lime-300" />
              <h3 className="font-display text-4xl uppercase tracking-[0.08em] text-lime-300">
                Booking Berhasil!
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                Lapangan kamu sudah terkonfirmasi
              </p>
              <div className="my-6 rounded-[4px] border border-dashed border-lime-300 bg-[#0a0a08] p-4 font-mono text-2xl tracking-[0.18em] text-lime-300">
                {bookingCode}
              </div>
              <p className="text-sm text-neutral-500">
                Screenshot kode ini sebagai bukti booking kamu.
              </p>
              <Button className="mt-6" onClick={onClose}>
                Selesai
              </Button>
            </div>
          ) : null}
        </div>
      </DialogContent>
      <QrisDialog open={qrisOpen} total={total} onOpenChange={setQrisOpen} />
    </Dialog>
  );
}

function BookingSummary({ rows }: { rows: [string, string][] }) {
  return (
    <div className="rounded-[4px] border border-neutral-800 bg-[#0a0a08] p-4">
      {rows.map(([label, value], index) => (
        <div
          key={label}
          className={cn(
            "flex justify-between gap-4 text-sm text-neutral-500",
            index !== rows.length - 1 && "mb-2",
            index === rows.length - 1 && "font-bold uppercase text-lime-300",
          )}
        >
          <span>{label}</span>
          <span className="text-right">{value}</span>
        </div>
      ))}
    </div>
  );
}
