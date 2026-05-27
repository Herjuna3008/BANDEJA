"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Coach, Role, Venue } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/shared/FormField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: Role;
  createdAt: Date;
}

interface Props {
  user: User;
  coachRecord: Coach | null;
  venueRecord: Venue | null;
}

const venueOwnerSchema = z.object({
  venueName: z.string().min(2),
  venueCode: z.string().min(2),
  shortName: z.string().min(1),
  area: z.string().min(1),
  district: z.string().min(1),
});

type VenueOwnerForm = z.infer<typeof venueOwnerSchema>;
type CoachForm = {
  specialty: string;
  experience: string;
  ratePerSession: string;
  bio?: string;
};

export function ProfileClient({ user, coachRecord, venueRecord }: Props) {
  const [tab, setTab] = useState<"info" | "venue-owner" | "coach">("info");
  const [loading, setLoading] = useState(false);

  const venueForm = useForm<VenueOwnerForm>({ resolver: zodResolver(venueOwnerSchema) });
  const coachForm = useForm<CoachForm>();

  async function submitVenueOwner(data: VenueOwnerForm) {
    setLoading(true);
    try {
      const res = await fetch("/api/register/venue-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Gagal mendaftar");
      }
      toast.success("Pendaftaran Venue Owner berhasil! Menunggu approval admin.");
      window.location.reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function submitCoach(data: CoachForm) {
    setLoading(true);
    try {
      const res = await fetch("/api/register/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ratePerSession: Number(data.ratePerSession) }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Gagal mendaftar");
      }
      toast.success("Pendaftaran Coach berhasil! Menunggu approval admin.");
      window.location.reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <Card className="mb-6 p-6">
        <div className="flex items-center gap-4">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name ?? ""} className="h-16 w-16 rounded-full" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lime-300/10 font-display text-2xl text-lime-300">
              {user.name?.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-bold text-neutral-100">{user.name}</h3>
            <p className="text-sm text-neutral-500">{user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={user.role} />
              <span className="text-xs text-neutral-600">
                Bergabung {format(new Date(user.createdAt), "MMMM yyyy", { locale: idLocale })}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs untuk daftar role */}
      {user.role === "USER" && !coachRecord && !venueRecord && (
        <div>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">
            // Tingkatkan Akun
          </p>
          <div className="mb-6 flex gap-2">
            <Button
              size="sm"
              variant={tab === "venue-owner" ? "default" : "secondary"}
              onClick={() => setTab("venue-owner")}
            >
              Daftar Venue Owner
            </Button>
            <Button
              size="sm"
              variant={tab === "coach" ? "default" : "secondary"}
              onClick={() => setTab("coach")}
            >
              Daftar Coach
            </Button>
          </div>

          {tab === "venue-owner" && (
            <Card className="p-6">
              <h4 className="mb-5 font-display text-2xl uppercase tracking-[0.06em]">
                Daftar sebagai Venue Owner
              </h4>
              <form className="grid gap-4" onSubmit={venueForm.handleSubmit(submitVenueOwner)}>
                <FormField label="Nama Venue" error={venueForm.formState.errors.venueName?.message}>
                  <Input placeholder="e.g. BANDEJA SOUTH" {...venueForm.register("venueName")} />
                </FormField>
                <FormField label="Kode Venue" error={venueForm.formState.errors.venueCode?.message}>
                  <Input placeholder="e.g. VENUE-SOUTH" {...venueForm.register("venueCode")} />
                </FormField>
                <FormField label="Nama Singkat" error={venueForm.formState.errors.shortName?.message}>
                  <Input placeholder="e.g. South" {...venueForm.register("shortName")} />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Area" error={venueForm.formState.errors.area?.message}>
                    <Input placeholder="e.g. Tangerang" {...venueForm.register("area")} />
                  </FormField>
                  <FormField label="Distrik" error={venueForm.formState.errors.district?.message}>
                    <Input placeholder="e.g. BSD City" {...venueForm.register("district")} />
                  </FormField>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Kirim Pendaftaran
                </Button>
              </form>
            </Card>
          )}

          {tab === "coach" && (
            <Card className="p-6">
              <h4 className="mb-5 font-display text-2xl uppercase tracking-[0.06em]">
                Daftar sebagai Coach
              </h4>
              <form className="grid gap-4" onSubmit={coachForm.handleSubmit(submitCoach)}>
                <FormField label="Specialty" error={coachForm.formState.errors.specialty?.message}>
                  <Input placeholder="e.g. Teknik & Rally" {...coachForm.register("specialty")} />
                </FormField>
                <FormField label="Pengalaman" error={coachForm.formState.errors.experience?.message}>
                  <Input placeholder="e.g. 5 Tahun Exp" {...coachForm.register("experience")} />
                </FormField>
                <FormField label="Rate per Sesi (IDR)" error={coachForm.formState.errors.ratePerSession?.message}>
                  <Input type="number" placeholder="200000" {...coachForm.register("ratePerSession")} />
                </FormField>
                <FormField label="Bio (opsional)">
                  <Input placeholder="Ceritakan tentang dirimu" {...coachForm.register("bio")} />
                </FormField>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Kirim Pendaftaran
                </Button>
              </form>
            </Card>
          )}
        </div>
      )}

      {venueRecord && (
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-neutral-100">{venueRecord.name}</p>
              <p className="text-sm text-neutral-500">Venue Owner</p>
            </div>
            <StatusBadge status={venueRecord.status} />
          </div>
        </Card>
      )}

      {coachRecord && (
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-neutral-100">{coachRecord.specialty}</p>
              <p className="text-sm text-neutral-500">Coach · {coachRecord.experience}</p>
            </div>
            <StatusBadge status={coachRecord.status} />
          </div>
        </Card>
      )}
    </div>
  );
}
