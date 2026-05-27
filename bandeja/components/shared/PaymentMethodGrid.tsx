import type { PaymentMethodId } from "@/types";
import { paymentMethods } from "@/data/payment";
import { cn } from "@/lib/utils";

interface PaymentMethodGridProps {
  selected: PaymentMethodId | null;
  onSelect: (method: PaymentMethodId) => void;
  onQrisOpen?: () => void;
}

export function PaymentMethodGrid({ onQrisOpen, selected, onSelect }: PaymentMethodGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup">
      {paymentMethods.map((method) => {
        const Icon = method.icon;
        const isSelected = selected === method.id;

        return (
          <button
            key={method.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => {
              onSelect(method.id);
              if (method.id === "qris") onQrisOpen?.();
            }}
            className={cn(
              "rounded-[4px] border border-neutral-800 bg-[#0a0a08] px-3 py-4 text-center text-xs text-neutral-500 transition-colors hover:border-lime-300 hover:text-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300",
              isSelected && "border-lime-300 bg-lime-300/5 text-lime-300",
            )}
          >
            <Icon className="mx-auto mb-2 h-6 w-6" aria-hidden="true" />
            {method.label}
          </button>
        );
      })}
    </div>
  );
}
