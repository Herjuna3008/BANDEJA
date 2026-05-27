"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  LayoutDashboard, CalendarDays, Users, Swords, User,
  Building2, CheckCircle, Trophy, CalendarRange, Settings, MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DashboardSidebar } from "./DashboardSidebar";
import { cn } from "@/lib/utils";

type Variant = "user" | "admin" | "venue-owner" | "coach";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_CONFIG: Record<Variant, { heading: string; items: NavItem[] }> = {
  user: {
    heading: "Dashboard",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Booking Lapangan", href: "/dashboard/bookings", icon: CalendarDays },
      { label: "Booking Pelatih", href: "/dashboard/coaches", icon: Users },
      { label: "Matchmaking", href: "/dashboard/matches", icon: Swords },
      { label: "Profil", href: "/dashboard/profile", icon: User },
    ],
  },
  admin: {
    heading: "Admin Panel",
    items: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
      { label: "Approval", href: "/admin/approvals", icon: CheckCircle },
      { label: "Kelola User", href: "/admin/users", icon: Users },
      { label: "Kelola Venue", href: "/admin/venues", icon: Building2 },
      { label: "Kelola Coach", href: "/admin/coaches", icon: Trophy },
      { label: "Kelola Booking", href: "/admin/bookings", icon: CalendarDays },
    ],
  },
  "venue-owner": {
    heading: "Venue Owner",
    items: [
      { label: "Overview", href: "/venue-owner", icon: LayoutDashboard },
      { label: "Kelola Lapangan", href: "/venue-owner/courts", icon: Building2 },
      { label: "Booking Masuk", href: "/venue-owner/bookings", icon: CalendarDays },
      { label: "Jadwal", href: "/venue-owner/schedule", icon: CalendarRange },
      { label: "Profil Venue", href: "/venue-owner/profile", icon: Settings },
    ],
  },
  coach: {
    heading: "Coach Dashboard",
    items: [
      { label: "Overview", href: "/coach-dashboard", icon: LayoutDashboard },
      { label: "Jadwal Saya", href: "/coach-dashboard/schedule", icon: CalendarDays },
      { label: "Client Saya", href: "/coach-dashboard/clients", icon: Users },
      { label: "Venue Saya", href: "/coach-dashboard/venues", icon: MapPin },
      { label: "Profil", href: "/coach-dashboard/profile", icon: User },
    ],
  },
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  variant: Variant;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
}

export function DashboardLayout({
  children,
  variant,
  userName,
  userEmail,
  userImage,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { heading, items } = NAV_CONFIG[variant];

  return (
    <div className="flex h-dvh overflow-hidden bg-[#0a0a08]">
      <div className="hidden md:block">
        <DashboardSidebar
          items={items}
          userName={userName}
          userEmail={userEmail}
          userImage={userImage}
        />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <DashboardSidebar
              items={items}
              userName={userName}
              userEmail={userEmail}
              userImage={userImage}
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-800 px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-[4px] border border-neutral-800 p-2 text-neutral-500 transition-colors hover:border-neutral-600 hover:text-neutral-200 md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="font-display text-xl uppercase tracking-[0.08em] text-neutral-100">
              {heading}
            </h1>
          </div>
          {sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-[4px] border border-neutral-800 p-2 text-neutral-500 md:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </header>

        <main className={cn("flex-1 overflow-y-auto p-6")}>{children}</main>
      </div>
    </div>
  );
}
