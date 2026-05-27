import { QrCode } from "lucide-react";
import type { PaymentMethod } from "@/types";

export const paymentMethods: PaymentMethod[] = [
  { id: "qris", label: "QRIS", icon: QrCode },
];
