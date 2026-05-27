"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Booking, Court } from "@prisma/client";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type BookingWithRelations = Booking & {
  user: { name: string | null; email: string | null };
  court: Court;
};

export function VenueBookingsClient({ bookings: initial }: { bookings: BookingWithRelations[] }) {
  const [bookings, setBookings] = useState(initial);

  async function updateStatus(id: string, status: "CONFIRMED" | "CANCELLED" | "COMPLETED") {
    try {
      const res = await fetch(`/api/venue-owner/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b)),
      );
      toast.success("Status booking diperbarui.");
    } catch {
      toast.error("Gagal memperbarui status.");
    }
  }

  const columns = [
    {
      key: "bookingCode",
      header: "Kode Booking",
      render: (b: BookingWithRelations) => (
        <span className="font-mono text-xs text-lime-300">{b.bookingCode}</span>
      ),
    },
    {
      key: "user",
      header: "Pemesan",
      render: (b: BookingWithRelations) => (
        <div>
          <p className="font-medium text-neutral-200">{b.user.name}</p>
          <p className="text-xs text-neutral-600">{b.user.email}</p>
        </div>
      ),
    },
    {
      key: "court",
      header: "Court",
      render: (b: BookingWithRelations) => (
        <span>{b.court.name}</span>
      ),
    },
    {
      key: "date",
      header: "Tanggal & Jam",
      render: (b: BookingWithRelations) => (
        <div>
          <p>{format(new Date(b.date), "d MMM yyyy", { locale: id })}</p>
          <p className="text-xs text-neutral-600">{b.startTime} · {b.duration}j</p>
        </div>
      ),
    },
    {
      key: "totalPrice",
      header: "Total",
      render: (b: BookingWithRelations) => (
        <span className="font-display text-lg text-lime-300">{formatCurrency(b.totalPrice)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (b: BookingWithRelations) => <StatusBadge status={b.status} />,
    },
    {
      key: "actions",
      header: "Aksi",
      render: (b: BookingWithRelations) => (
        <div className="flex gap-1">
          {b.status === "CONFIRMED" && (
            <>
              <Button size="sm" variant="secondary" onClick={() => updateStatus(b.id, "COMPLETED")}>
                Selesai
              </Button>
              <Button size="sm" variant="destructive" onClick={() => updateStatus(b.id, "CANCELLED")}>
                Batal
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={bookings}
      keyExtractor={(b) => b.id}
      emptyMessage="Belum ada booking masuk."
    />
  );
}
