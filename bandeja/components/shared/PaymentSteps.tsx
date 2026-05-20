import { Check } from "lucide-react";
import type { PaymentStep } from "@/types";
import { cn } from "@/lib/utils";

const steps: { id: PaymentStep; label: string }[] = [
  { id: "details", label: "Detail" },
  { id: "payment", label: "Bayar" },
  { id: "success", label: "Konfirmasi" },
];

export function PaymentSteps({ current }: { current: PaymentStep }) {
  const currentIndex = steps.findIndex((step) => step.id === current);

  return (
    <div className="mb-7 grid grid-cols-3 gap-2" aria-label="Tahap pembayaran">
      {steps.map((step, index) => {
        const active = index === currentIndex;
        const done = index < currentIndex;

        return (
          <div
            key={step.id}
            className={cn(
              "text-center font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-600",
              active && "text-lime-300",
              done && "text-lime-300",
            )}
          >
            <span
              className={cn(
                "mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-neutral-800 text-xs transition-colors",
                active && "border-lime-300 bg-lime-300 font-bold text-neutral-950",
                done && "border-lime-300 text-lime-300",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </span>
            {step.label}
          </div>
        );
      })}
    </div>
  );
}
