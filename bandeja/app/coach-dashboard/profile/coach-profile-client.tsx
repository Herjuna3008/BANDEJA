"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Coach } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/shared/FormField";

type CoachForm = {
  specialty: string;
  experience: string;
  ratePerSession: string;
  bio: string;
};

export function CoachProfileClient({ coach }: { coach: Coach }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<CoachForm>({
    defaultValues: {
      specialty: coach.specialty,
      experience: coach.experience,
      ratePerSession: String(coach.ratePerSession),
      bio: coach.bio ?? "",
    },
  });

  async function onSubmit(data: CoachForm) {
    setLoading(true);
    try {
      const res = await fetch(`/api/coach-dashboard/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ratePerSession: Number(data.ratePerSession) }),
      });
      if (!res.ok) throw new Error();
      toast.success("Profil coach diperbarui.");
    } catch {
      toast.error("Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-lg p-6">
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField label="Specialty" error={form.formState.errors.specialty?.message}>
          <Input {...form.register("specialty", { required: "Wajib diisi" })} />
        </FormField>
        <FormField label="Pengalaman" error={form.formState.errors.experience?.message}>
          <Input {...form.register("experience", { required: "Wajib diisi" })} />
        </FormField>
        <FormField label="Rate per Sesi (IDR)" error={form.formState.errors.ratePerSession?.message}>
          <Input type="number" {...form.register("ratePerSession", { required: "Wajib diisi" })} />
        </FormField>
        <FormField label="Bio">
          <Input {...form.register("bio")} />
        </FormField>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Simpan Perubahan
        </Button>
      </form>
    </Card>
  );
}
