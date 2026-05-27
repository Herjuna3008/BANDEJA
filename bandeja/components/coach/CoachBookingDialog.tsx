"use client";

import { useEffect } from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Medal } from "lucide-react";
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
import { FormField } from "@/components/shared/FormField";
import { PaymentMethodGrid } from "@/components/shared/PaymentMethodGrid";
import { PaymentSteps } from "@/components/shared/PaymentSteps";
import { QrisDialog } from "@/components/shared/QrisDialog";
import type { Coach, PaymentMethodId, PaymentStep } from "@/types";
import { coachBookingSchema, type CoachBookingFormValues } from "@/lib/validations";
import { cn, formatCurrency } from "@/lib/utils";

interface CoachBookingDialogProps {
  bookingCode: string;
  coach: Coach | null;
  coachVenues: { id: string; name: string }[];
  isProcessing: boolean;
  paymentMethod: PaymentMethodId | null;
  sessions: number;
  step: PaymentStep;
  total: number;
  onClose: () => void;
  onConfirmPayment: (formValues: CoachBookingFormValues) => Promise<void>;
  onPaymentMethodChange: (method: PaymentMethodId) => void;
  onSessionsChange: (sessions: number) => void;
  onStepChange: (step: PaymentStep) => void;
}

export function CoachBookingDialog({
  bookingCode,
  coach,
  coachVenues,
  isProcessing,
  onClose,
  onConfirmPayment,
  onPaymentMethodChange,
  onSessionsChange,
  onStepChange,
  paymentMethod,
  sessions,
  step,
  total,
}: CoachBookingDialogProps) {
  const [qrisOpen, setQrisOpen] = useState(false);
  const form = useForm<CoachBookingFormValues>({
    resolver: zodResolver(coachBookingSchema),
    defaultValues: { name: "", venue: coachVenues[0]?.id ?? "", date: "", time: "", sessions: 1 },
  });

  useEffect(() => {
    form.setValue("sessions", sessions);
  }, [form, sessions]);

  useEffect(() => {
    if (coachVenues[0]?.id) {
      form.setValue("venue", coachVenues[0].id);
    }
  }, [form, coachVenues]);

  if (!coach) return null;

  function handleDetailsSubmit() {
    form.clearErrors("root");
    onStepChange("payment");
  }

  async function handlePaymentSubmit() {
    if (!paymentMethod) {
      form.setError("root", { message: "Pilih metode pembayaran" });
      return;
    }
    form.clearErrors("root");
    const values = form.getValues();
    try {
      await onConfirmPayment(values);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Booking gagal";
      form.setError("root", { message: msg });
    }
  }

  return (
    <Dialog open={Boolean(coach)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book - {coach.name}</DialogTitle>
          <DialogDescription>{coach.specialty}</DialogDescription>
        </DialogHeader>
        <div className="px-8 py-7">
          <PaymentSteps current={step} />

          {step === "details" ? (
            <form className="grid gap-5" onSubmit={form.handleSubmit(handleDetailsSubmit)}>
              <FormField label="Nama Kamu" error={form.formState.errors.name?.message}>
                <Input placeholder="Nama lengkap" {...form.register("name")} />
              </FormField>
              <FormField label="Venue" error={form.formState.errors.venue?.message}>
                <Select
                  defaultValue={coachVenues[0]?.id}
                  onValueChange={(value) => form.setValue("venue", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {coachVenues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Tanggal" error={form.formState.errors.date?.message}>
                  <Input type="date" {...form.register("date")} />
                </FormField>
                <FormField label="Jam Mulai" error={form.formState.errors.time?.message}>
                  <Input type="time" {...form.register("time")} />
                </FormField>
              </div>
              <FormField label="Jumlah Sesi" error={form.formState.errors.sessions?.message}>
                <Select
                  value={String(sessions)}
                  onValueChange={(value) => onSessionsChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sesi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Sesi (90 menit)</SelectItem>
                    <SelectItem value="2">2 Sesi</SelectItem>
                    <SelectItem value="4">4 Sesi (Paket)</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <Summary
                rows={[
                  ["Pelatih", coach.name],
                  ["Sesi", `${sessions} Sesi`],
                  ["Total", formatCurrency(total)],
                ]}
              />
              <Button type="submit">Lanjut ke Pembayaran</Button>
            </form>
          ) : null}

          {step === "payment" ? (
            <div className="grid gap-5">
              <Summary rows={[["Total", formatCurrency(total)]]} />
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                  Metode Pembayaran
                </p>
                <PaymentMethodGrid
                  selected={paymentMethod}
                  onSelect={(method) => {
                    onPaymentMethodChange(method);
                    form.clearErrors("root");
                  }}
                  onQrisOpen={() => setQrisOpen(true)}
                />
              </div>
              {form.formState.errors.root?.message ? (
                <p className="text-sm text-orange-400">{form.formState.errors.root.message}</p>
              ) : null}
              <Button disabled={isProcessing} onClick={handlePaymentSubmit}>
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Konfirmasi Pembayaran
              </Button>
            </div>
          ) : null}

          {step === "success" ? (
            <div className="py-3 text-center">
              <Medal className="mx-auto mb-5 h-16 w-16 text-lime-300" />
              <h3 className="font-display text-4xl uppercase tracking-[0.08em] text-lime-300">
                Sesi Terjadwal!
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                Pelatihmu sudah konfirmasi sesi latihan.
              </p>
              <div className="my-6 rounded-[4px] border border-dashed border-lime-300 bg-[#0a0a08] p-4 font-mono text-2xl tracking-[0.18em] text-lime-300">
                {bookingCode}
              </div>
              <Button onClick={onClose}>Selesai</Button>
            </div>
          ) : null}
        </div>
      </DialogContent>
      <QrisDialog open={qrisOpen} total={total} onOpenChange={setQrisOpen} />
    </Dialog>
  );
}

function Summary({ rows }: { rows: [string, string][] }) {
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
