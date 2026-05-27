"use client";

import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";

type VenueRow = {
  id: string;
  name: string;
  area: string;
  district: string;
  status: string;
  owner: { name: string | null; email: string };
  courts: { id: string }[];
};

const columns = [
  {
    key: "name",
    header: "Venue",
    render: (v: VenueRow) => (
      <div>
        <p className="font-medium text-neutral-200">{v.name}</p>
        <p className="text-xs text-neutral-500">{v.area} — {v.district}</p>
      </div>
    ),
  },
  {
    key: "owner",
    header: "Owner",
    render: (v: VenueRow) => (
      <div>
        <p className="text-neutral-300">{v.owner.name}</p>
        <p className="text-xs text-neutral-600">{v.owner.email}</p>
      </div>
    ),
  },
  {
    key: "courts",
    header: "Courts",
    render: (v: VenueRow) => (
      <span className="text-neutral-400">{v.courts.length} court</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (v: VenueRow) => <StatusBadge status={v.status} />,
  },
];

export function VenuesTable({ venues }: { venues: VenueRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={venues}
      keyExtractor={(v) => v.id}
      emptyMessage="Belum ada venue."
    />
  );
}
