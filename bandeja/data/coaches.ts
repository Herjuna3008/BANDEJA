import { Dumbbell, Medal, Shield, Sparkles } from "lucide-react";
import type { Coach } from "@/types";

export const coaches: Coach[] = [
  {
    id: "rafa-santana",
    name: "Rafa Santana",
    specialty: "Teknik & Rally",
    experience: "8 Tahun Exp",
    ratePerSession: 200000,
    status: "available",
    tone: "lime",
    icon: Dumbbell,
  },
  {
    id: "marco-diaz",
    name: "Marco Diaz",
    specialty: "Smash & Power",
    experience: "12 Tahun Exp",
    ratePerSession: 250000,
    status: "busy",
    tone: "orange",
    icon: Medal,
  },
  {
    id: "lisa-chen",
    name: "Lisa Chen",
    specialty: "Footwork & Defense",
    experience: "6 Tahun Exp",
    ratePerSession: 180000,
    status: "available",
    tone: "teal",
    icon: Shield,
  },
  {
    id: "andre-putra",
    name: "Andre Putra",
    specialty: "Strategi & Doubles",
    experience: "10 Tahun Exp",
    ratePerSession: 220000,
    status: "available",
    tone: "gold",
    icon: Sparkles,
  },
];
