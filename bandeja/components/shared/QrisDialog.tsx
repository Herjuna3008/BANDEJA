"use client";

import Image from "next/image";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";

interface QrisDialogProps {
  open: boolean;
  total: number;
  onOpenChange: (open: boolean) => void;
}

export function QrisDialog({ onOpenChange, open, total }: QrisDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-6 w-6 text-lime-300" />
            QRIS Payment
          </DialogTitle>
          <DialogDescription>
            Scan QRIS ini dari aplikasi pembayaran kamu, lalu kembali ke halaman ini untuk
            konfirmasi.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 pt-5">
          <div className="mb-4 rounded-[4px] border border-neutral-800 bg-[#0a0a08] p-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
              Total Pembayaran
            </p>
            <p className="mt-1 font-display text-3xl text-lime-300">
              {formatCurrency(total)}
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-neutral-800 bg-white p-2">
            <Image
              src="/qris-herjuna.jpeg"
              alt="QRIS Herjuna Saputra Mahadana"
              width={900}
              height={1280}
              className="h-auto w-full rounded-md"
              priority
            />
          </div>

          <Button className="mt-5 w-full" onClick={() => onOpenChange(false)}>
            Saya Sudah Scan QRIS
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
