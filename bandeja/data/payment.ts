import { Building2, CreditCard, Landmark, Store, Wallet, Waves } from "lucide-react";
import type { PaymentMethod } from "@/types";

export const paymentMethods: PaymentMethod[] = [
  { id: "bank", label: "Transfer Bank", icon: Landmark },
  { id: "gopay", label: "GoPay", icon: Wallet },
  { id: "ovo", label: "OVO", icon: Waves },
  { id: "dana", label: "DANA", icon: Building2 },
  { id: "card", label: "Kartu Kredit", icon: CreditCard },
  { id: "retail", label: "Indomaret", icon: Store },
];
