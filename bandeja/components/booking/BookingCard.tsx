"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface BookingCardProps {
  bookingCode: string;
  courtName: string;
  venueName: string;
  date: Date | string;
  startTime: string;
  duration: number;
  totalPrice: number;
  status: string;
  paymentMethod: string;
}

export function BookingCard({
  bookingCode,
  courtName,
  venueName,
  date,
  startTime,
  duration,
  totalPrice,
  status,
  paymentMethod,
}: BookingCardProps) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            {bookingCode}
          </p>
          <h4 className="mt-1 font-bold text-neutral-100">{courtName}</h4>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mb-4 space-y-1.5 text-sm text-neutral-500">
        <p className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-lime-300" />
          {venueName}
        </p>
        <p className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-lime-300" />
          {format(dateObj, "EEEE, d MMMM yyyy", { locale: id })}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 shrink-0 text-lime-300" />
          {startTime} · {duration} jam
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-600">
          {paymentMethod}
        </span>
        <span className="font-display text-xl text-lime-300">{formatCurrency(totalPrice)}</span>
      </div>
    </Card>
  );
}
