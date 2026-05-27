import type { LucideIcon } from "lucide-react";

export type VenueTone = "lime" | "orange" | "teal";
export type CourtSurface = "Indoor" | "Outdoor";
export type CourtStatus = "available" | "booked";
export type PlayerLevel = "beginner" | "intermediate" | "advanced";
export type PaymentStep = "details" | "payment" | "success";
export type PaymentMethodId =
  | "qris"
  | "bank"
  | "gopay"
  | "ovo"
  | "dana"
  | "card"
  | "retail";

export interface Court {
  id: string;
  name: string;
  surface: CourtSurface;
  status: CourtStatus;
}

export interface Venue {
  id: string;
  code: string;
  name: string;
  shortName: string;
  area: string;
  district: string;
  pricePerHour: number;
  tone: VenueTone;
  courts: Court[];
}

export interface Coach {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  ratePerSession: number;
  status: "available" | "busy";
  tone: VenueTone | "gold";
  icon: LucideIcon;
}

export interface MatchPost {
  id: string;
  player: string;
  level: PlayerLevel;
  venueCourt: string;
  date: string;
  time: string;
  format: "Singles (1v1)" | "Doubles (2v2)" | "Fleksibel";
}

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  icon: LucideIcon;
}
