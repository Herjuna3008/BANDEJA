"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Venue } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/shared/FormField";

const schema = z.object({
  name: z.string().min(2),
  area: z.string().min(1),
  district: z.string().min(1),
});
type FormData = z.infer<typeof schema>;

export function VenueProfileClient({ venue }: { venue: Venue }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: venue.name, area: venue.area, district: venue.district },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const res = await fetch(`/api/venue-owner/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Profil venue diperbarui.");
    } catch {
      toast.error("Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-lg p-6">
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField label="Nama Venue" error={form.formState.errors.name?.message}>
          <Input {...form.register("name")} />
        </FormField>
        <FormField label="Area" error={form.formState.errors.area?.message}>
          <Input {...form.register("area")} />
        </FormField>
        <FormField label="Distrik" error={form.formState.errors.district?.message}>
          <Input {...form.register("district")} />
        </FormField>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Simpan Perubahan
        </Button>
      </form>
    </Card>
  );
}
