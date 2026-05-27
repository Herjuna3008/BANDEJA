import type { Venue } from "@/types";

export const venues: Venue[] = [
  {
    id: "south",
    code: "NEW VENUE",
    name: "URBAN PADEL GADING SERPONG",
    shortName: "South",
    area: "Tangerang",
    district: "Gading Serpong",
    pricePerHour: 120000,
    tone: "lime",
    courts: [
      { id: "A1", name: "Court A1", surface: "Indoor", status: "available" },
      { id: "A2", name: "Court A2", surface: "Indoor", status: "available" },
      { id: "A3", name: "Court A3", surface: "Outdoor", status: "booked" },
      { id: "A4", name: "Court A4", surface: "Outdoor", status: "available" },
    ],
  },
  {
    id: "north",
    code: "VENUE BSD",
    name: "RED WOOD PADEL BSD",
    shortName: "RED WOOD",
    area: "TANGERANG SELATAN",
    district: "BSD CITY",
    pricePerHour: 100000,
    tone: "orange",
    courts: [
      { id: "B1", name: "Court B1", surface: "Indoor", status: "available" },
      { id: "B2", name: "Court B2", surface: "Indoor", status: "booked" },
      { id: "B3", name: "Court B3", surface: "Indoor", status: "booked" },
      { id: "B4", name: "Court B4", surface: "Outdoor", status: "available" },
    ],
  },
  {
    id: "west",
    code: "VENUE ALAM SUTERA",
    name: "GANCHO ARENA",
    shortName: "GANCHO ARENA",
    area: "TANGERANG SELATAN",
    district: "ALAM SUTERA",
    pricePerHour: 90000,
    tone: "teal",
    courts: [
      { id: "C1", name: "Court C1", surface: "Indoor", status: "available" },
      { id: "C2", name: "Court C2", surface: "Indoor", status: "available" },
      { id: "C3", name: "Court C3", surface: "Indoor", status: "available" },
      { id: "C4", name: "Court C4", surface: "Outdoor", status: "booked" },
    ],
  },
];

export const availableCourtOptions = venues.flatMap((venue) =>
  venue.courts
    .filter((court) => court.status === "available")
    .map((court) => `${venue.name} - ${court.id}`),
);
