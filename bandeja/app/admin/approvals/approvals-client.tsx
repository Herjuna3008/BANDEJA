"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Coach, User, Venue } from "@prisma/client";
import { ApprovalCard } from "@/components/admin/ApprovalCard";
import { Button } from "@/components/ui/button";

type PendingVenue = Venue & { owner: Pick<User, "name" | "email" | "image"> };
type PendingCoach = Coach & { user: Pick<User, "name" | "email" | "image"> };

interface Props {
  pendingVenues: PendingVenue[];
  pendingCoaches: PendingCoach[];
}

type TabType = "venues" | "coaches";

export function ApprovalsClient({ pendingVenues: initial_v, pendingCoaches: initial_c }: Props) {
  const [tab, setTab] = useState<TabType>("venues");
  const [venues, setVenues] = useState(initial_v);
  const [coaches, setCoaches] = useState(initial_c);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleApproval(id: string, type: "venue" | "coach", action: "approve" | "reject") {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/approvals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, action }),
      });
      if (!res.ok) throw new Error();

      if (type === "venue") {
        setVenues((prev) => prev.filter((v) => v.id !== id));
      } else {
        setCoaches((prev) => prev.filter((c) => c.id !== id));
      }
      toast.success(`${type === "venue" ? "Venue" : "Coach"} ${action === "approve" ? "disetujui" : "ditolak"}.`);
    } catch {
      toast.error("Gagal memproses approval.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <Button
          size="sm"
          variant={tab === "venues" ? "default" : "secondary"}
          onClick={() => setTab("venues")}
        >
          Venue Owner Pending ({venues.length})
        </Button>
        <Button
          size="sm"
          variant={tab === "coaches" ? "default" : "secondary"}
          onClick={() => setTab("coaches")}
        >
          Coach Pending ({coaches.length})
        </Button>
      </div>

      {tab === "venues" && (
        <div>
          {venues.length === 0 ? (
            <p className="text-neutral-500">Tidak ada venue owner pending.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {venues.map((venue) => (
                <ApprovalCard
                  key={venue.id}
                  name={venue.owner.name ?? ""}
                  email={venue.owner.email ?? ""}
                  image={venue.owner.image}
                  detail={venue.name}
                  meta={`${venue.area} — ${venue.district}`}
                  isLoading={loading === venue.id}
                  onApprove={() => handleApproval(venue.id, "venue", "approve")}
                  onReject={() => handleApproval(venue.id, "venue", "reject")}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "coaches" && (
        <div>
          {coaches.length === 0 ? (
            <p className="text-neutral-500">Tidak ada coach pending.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coaches.map((coach) => (
                <ApprovalCard
                  key={coach.id}
                  name={coach.user.name ?? ""}
                  email={coach.user.email ?? ""}
                  image={coach.user.image}
                  detail={coach.specialty}
                  meta={`${coach.experience} · Rp ${coach.ratePerSession.toLocaleString("id-ID")} / sesi`}
                  isLoading={loading === coach.id}
                  onApprove={() => handleApproval(coach.id, "coach", "approve")}
                  onReject={() => handleApproval(coach.id, "coach", "reject")}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
