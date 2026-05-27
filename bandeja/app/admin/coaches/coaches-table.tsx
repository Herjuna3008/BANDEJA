"use client";

import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency } from "@/lib/utils";

type CoachRow = {
  id: string;
  specialty: string;
  experience: string;
  ratePerSession: number;
  status: string;
  user: { name: string | null; email: string; image: string | null };
};

const columns = [
  {
    key: "user",
    header: "Coach",
    render: (c: CoachRow) => (
      <div className="flex items-center gap-3">
        {c.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.user.image} alt="" className="h-7 w-7 rounded-full" />
        ) : null}
        <div>
          <p className="font-medium text-neutral-200">{c.user.name}</p>
          <p className="text-xs text-neutral-600">{c.user.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "specialty",
    header: "Specialty",
    render: (c: CoachRow) => (
      <div>
        <p className="text-neutral-300">{c.specialty}</p>
        <p className="text-xs text-neutral-600">{c.experience}</p>
      </div>
    ),
  },
  {
    key: "ratePerSession",
    header: "Rate",
    render: (c: CoachRow) => (
      <span className="font-display text-lg text-lime-300">
        {formatCurrency(c.ratePerSession)}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (c: CoachRow) => <StatusBadge status={c.status} />,
  },
];

export function CoachesTable({ coaches }: { coaches: CoachRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={coaches}
      keyExtractor={(c) => c.id}
      emptyMessage="Belum ada coach."
    />
  );
}
