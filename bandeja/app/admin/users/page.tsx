import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UsersTable } from "./users-table";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
  });

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Kelola User ({users.length})
      </h2>
      <UsersTable users={users} />
    </div>
  );
}
