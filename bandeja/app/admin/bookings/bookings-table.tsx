"use client";

import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type CourtBookingRow = {
  id: string;
  bookingCode: string;
  startTime: string;
  totalPrice: number;
  status: string;
  date: Date;
  user: { name: string | null };
  court: { name: string; venue: { name: string } };
};

type CoachBookingRow = {
  id: string;
  bookingCode: string;
  time: string;
  totalPrice: number;
  status: string;
  date: Date;
  user: { name: string | null };
  coach: { user: { name: string | null } };
};

const courtColumns = [
  {
    key: "bookingCode",
    header: "Kode",
    render: (b: CourtBookingRow) => (
      <span className="font-mono text-xs text-lime-300">{b.bookingCode}</span>
    ),
  },
  {
    key: "user",
    header: "Pemesan",
    render: (b: CourtBookingRow) => (
      <p className="text-neutral-300">{b.user.name}</p>
    ),
  },
  {
    key: "court",
    header: "Court · Venue",
    render: (b: CourtBookingRow) => (
      <div>
        <p className="text-neutral-300">{b.court.name}</p>
        <p className="text-xs text-neutral-600">{b.court.venue.name}</p>
      </div>
    ),
  },
  {
    key: "date",
    header: "Tanggal",
    render: (b: CourtBookingRow) => (
      <span className="text-xs text-neutral-400">
        {format(new Date(b.date), "d MMM yyyy", { locale: id })} · {b.startTime}
      </span>
    ),
  },
  {
    key: "totalPrice",
    header: "Total",
    render: (b: CourtBookingRow) => (
      <span className="font-display text-lg text-lime-300">{formatCurrency(b.totalPrice)}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (b: CourtBookingRow) => <StatusBadge status={b.status} />,
  },
];

const coachColumns = [
  {
    key: "bookingCode",
    header: "Kode",
    render: (b: CoachBookingRow) => (
      <span className="font-mono text-xs text-lime-300">{b.bookingCode}</span>
    ),
  },
  {
    key: "user",
    header: "Pemesan",
    render: (b: CoachBookingRow) => (
      <p className="text-neutral-300">{b.user.name}</p>
    ),
  },
  {
    key: "coach",
    header: "Coach",
    render: (b: CoachBookingRow) => (
      <p className="text-neutral-300">{b.coach.user.name}</p>
    ),
  },
  {
    key: "date",
    header: "Tanggal",
    render: (b: CoachBookingRow) => (
      <span className="text-xs text-neutral-400">
        {format(new Date(b.date), "d MMM yyyy", { locale: id })} · {b.time}
      </span>
    ),
  },
  {
    key: "totalPrice",
    header: "Total",
    render: (b: CoachBookingRow) => (
      <span className="font-display text-lg text-lime-300">{formatCurrency(b.totalPrice)}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (b: CoachBookingRow) => <StatusBadge status={b.status} />,
  },
];

export function BookingsTable({
  courtBookings,
  coachBookings,
}: {
  courtBookings: CourtBookingRow[];
  coachBookings: CoachBookingRow[];
}) {
  return (
    <div>
      <div className="mb-8">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">
          // Court Booking ({courtBookings.length})
        </p>
        <DataTable
          columns={courtColumns}
          data={courtBookings}
          keyExtractor={(b) => b.id}
          emptyMessage="Belum ada court booking."
        />
      </div>
      <div>
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">
          // Coach Booking ({coachBookings.length})
        </p>
        <DataTable
          columns={coachColumns}
          data={coachBookings}
          keyExtractor={(b) => b.id}
          emptyMessage="Belum ada coach booking."
        />
      </div>
    </div>
  );
}
