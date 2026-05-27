"use client";

import { cn } from "@/lib/utils";

type Status =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | string;

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Menunggu",
    className: "bg-yellow-400/15 text-yellow-400",
  },
  APPROVED: {
    label: "Disetujui",
    className: "bg-lime-300/15 text-lime-300",
  },
  REJECTED: {
    label: "Ditolak",
    className: "bg-red-500/15 text-red-400",
  },
  CONFIRMED: {
    label: "Dikonfirmasi",
    className: "bg-lime-300/15 text-lime-300",
  },
  CANCELLED: {
    label: "Dibatalkan",
    className: "bg-red-500/15 text-red-400",
  },
  COMPLETED: {
    label: "Selesai",
    className: "bg-neutral-500/15 text-neutral-400",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-neutral-500/15 text-neutral-400",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
