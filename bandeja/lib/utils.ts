import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function generateBookingCode(prefix = "BDJ") {
  return `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;
}

export function levelLabel(level: string) {
  const labels: Record<string, string> = {
    beginner: "Pemula",
    intermediate: "Menengah",
    advanced: "Pro",
  };

  return labels[level] ?? level;
}
