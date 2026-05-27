"use client";

import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: Date;
};

const columns = [
  {
    key: "name",
    header: "User",
    render: (u: UserRow) => (
      <div className="flex items-center gap-3">
        {u.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={u.image} alt="" className="h-7 w-7 rounded-full" />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-lime-300">
            {u.name?.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-medium text-neutral-200">{u.name}</p>
          <p className="text-xs text-neutral-600">{u.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    render: (u: UserRow) => <StatusBadge status={u.role} />,
  },
  {
    key: "createdAt",
    header: "Bergabung",
    render: (u: UserRow) => (
      <span className="text-xs text-neutral-500">
        {format(new Date(u.createdAt), "d MMM yyyy", { locale: id })}
      </span>
    ),
  },
];

export function UsersTable({ users }: { users: UserRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={users}
      keyExtractor={(u) => u.id}
      emptyMessage="Belum ada user."
    />
  );
}
