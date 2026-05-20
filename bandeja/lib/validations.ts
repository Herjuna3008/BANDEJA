import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().min(8, "Nomor HP belum valid"),
  date: z.string().min(1, "Tanggal wajib dipilih"),
  duration: z.number().min(1).max(3),
});

export const coachBookingSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  venue: z.string().min(1, "Venue wajib dipilih"),
  date: z.string().min(1, "Tanggal wajib dipilih"),
  time: z.string().min(1, "Jam wajib dipilih"),
  sessions: z.number().min(1).max(4),
});

export const matchPostSchema = z.object({
  player: z.string().min(2, "Nama minimal 2 karakter"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  venueCourt: z.string().min(1, "Venue wajib dipilih"),
  date: z.string().min(1, "Tanggal wajib dipilih"),
  time: z.string().min(1, "Jam wajib dipilih"),
  format: z.enum(["Singles (1v1)", "Doubles (2v2)", "Fleksibel"]),
});

export const autoMatchSchema = z.object({
  name: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  venue: z.string(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
export type CoachBookingFormValues = z.infer<typeof coachBookingSchema>;
export type MatchPostFormValues = z.infer<typeof matchPostSchema>;
export type AutoMatchFormValues = z.infer<typeof autoMatchSchema>;
