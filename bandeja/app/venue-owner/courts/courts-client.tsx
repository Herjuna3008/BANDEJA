"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import type { Court } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/shared/FormField";
import { formatCurrency, cn } from "@/lib/utils";

type CourtForm = {
  name: string;
  surface: "INDOOR" | "OUTDOOR";
  pricePerHour: string;
};

export function CourtsClient({ courts: initialCourts }: { courts: Court[] }) {
  const [courts, setCourts] = useState<Court[]>(initialCourts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<CourtForm>({
    defaultValues: { name: "", surface: "INDOOR", pricePerHour: "100000" },
  });

  function openCreate() {
    setEditingCourt(null);
    form.reset({ name: "", surface: "INDOOR", pricePerHour: "100000" });
    setDialogOpen(true);
  }

  function openEdit(court: Court) {
    setEditingCourt(court);
    form.reset({
      name: court.name,
      surface: court.surface,
      pricePerHour: String(court.pricePerHour),
    });
    setDialogOpen(true);
  }

  async function handleSubmit(data: CourtForm) {
    const payload = { ...data, pricePerHour: Number(data.pricePerHour) };
    setLoading(true);
    try {
      if (editingCourt) {
        const res = await fetch(`/api/venue-owner/courts/${editingCourt.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setCourts((prev) => prev.map((c) => (c.id === editingCourt.id ? updated : c)));
        toast.success("Court diperbarui.");
      } else {
        const res = await fetch("/api/venue-owner/courts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setCourts((prev) => [...prev, created]);
        toast.success("Court ditambahkan.");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Gagal menyimpan court.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusToggle(court: Court) {
    const newStatus = court.status === "AVAILABLE" ? "MAINTENANCE" : "AVAILABLE";
    try {
      const res = await fetch(`/api/venue-owner/courts/${court.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setCourts((prev) => prev.map((c) => (c.id === court.id ? updated : c)));
      toast.success(`Court set ke ${newStatus}.`);
    } catch {
      toast.error("Gagal mengubah status.");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/venue-owner/courts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setCourts((prev) => prev.filter((c) => c.id !== id));
      toast.success("Court dihapus.");
    } catch {
      toast.error("Gagal menghapus court.");
    }
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Tambah Court
        </Button>
      </div>

      {courts.length === 0 ? (
        <Card className="p-12 text-center text-neutral-500">
          Belum ada court. Tambahkan court pertama.
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courts.map((court) => (
            <Card key={court.id} className="p-5">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-neutral-100">{court.name}</h4>
                  <p className="text-xs text-neutral-500">{court.surface}</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase",
                    court.status === "AVAILABLE"
                      ? "bg-lime-300/15 text-lime-300"
                      : "bg-orange-500/15 text-orange-400",
                  )}
                >
                  {court.status === "AVAILABLE" ? "Tersedia" : "Maintenance"}
                </span>
              </div>

              <p className="mb-4 font-display text-2xl text-lime-300">
                {formatCurrency(court.pricePerHour)}{" "}
                <span className="font-sans text-xs text-neutral-500">/ jam</span>
              </p>

              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => openEdit(court)}>
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button size="sm" variant="secondary" onClick={() => handleStatusToggle(court)}>
                  {court.status === "AVAILABLE" ? "Set Maintenance" : "Set Tersedia"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => handleDelete(court.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCourt ? "Edit Court" : "Tambah Court"}</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <form className="grid gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField label="Nama Court" error={form.formState.errors.name?.message}>
                <Input placeholder="e.g. Court A1" {...form.register("name", { required: "Wajib diisi" })} />
              </FormField>
              <FormField label="Surface">
                <Select
                  defaultValue={editingCourt?.surface ?? "INDOOR"}
                  onValueChange={(v) => form.setValue("surface", v as "INDOOR" | "OUTDOOR")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INDOOR">Indoor</SelectItem>
                    <SelectItem value="OUTDOOR">Outdoor</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Harga per Jam (IDR)" error={form.formState.errors.pricePerHour?.message}>
                <Input
                  type="number"
                  {...form.register("pricePerHour", { required: "Wajib diisi" })}
                />
              </FormField>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingCourt ? "Simpan Perubahan" : "Tambah Court"}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
