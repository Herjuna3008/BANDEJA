import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default async function CoachClientsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const coach = await prisma.coach.findFirst({ where: { userId: session.user.id } });
  if (!coach) return <div className="text-neutral-500 p-12 text-center">Coach record tidak ditemukan.</div>;

  const bookings = await prisma.coachBooking.findMany({
    where: { coachId: coach.id },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
  });

  const clientMap = new Map<
    string,
    { user: (typeof bookings)[0]["user"]; sessions: number; total: number }
  >();
  for (const b of bookings) {
    const entry = clientMap.get(b.userId) ?? { user: b.user, sessions: 0, total: 0 };
    entry.sessions += b.sessions;
    entry.total += b.totalPrice;
    clientMap.set(b.userId, entry);
  }
  const clients = Array.from(clientMap.values());

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Client Saya ({clients.length})
      </h2>

      {clients.length === 0 ? (
        <Card className="p-12 text-center text-neutral-500">Belum ada client.</Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map(({ user, sessions, total }) => (
            <Card key={user.id} className="p-5">
              <div className="flex items-center gap-3">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt="" className="h-10 w-10 rounded-full" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 font-display text-lg text-lime-300">
                    {user.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-neutral-100">{user.name}</p>
                  <p className="text-xs text-neutral-500">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between border-t border-neutral-800 pt-3 text-sm text-neutral-500">
                <span>{sessions} sesi total</span>
                <span className="text-lime-300">{formatCurrency(total)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
