"use client";

import { signOut } from "next-auth/react";
import {
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Shield,
  Trophy,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Role } from "@prisma/client";

interface UserDropdownProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
}

function dashboardHref(role: Role) {
  if (role === "ADMIN") return "/admin";
  if (role === "VENUE_OWNER") return "/venue-owner";
  if (role === "COACH") return "/coach-dashboard";
  return "/dashboard";
}

function dashboardLabel(role: Role) {
  if (role === "ADMIN") return "Admin Panel";
  if (role === "VENUE_OWNER") return "Venue Dashboard";
  if (role === "COACH") return "Coach Dashboard";
  return "Dashboard Saya";
}

function DashboardIcon({ role }: { role: Role }) {
  if (role === "ADMIN") return <Shield className="h-4 w-4" />;
  if (role === "VENUE_OWNER") return <Trophy className="h-4 w-4" />;
  if (role === "COACH") return <BookOpen className="h-4 w-4" />;
  return <LayoutDashboard className="h-4 w-4" />;
}

export function UserDropdown({ name, email, image, role }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-[4px] border border-neutral-800 px-3 py-2 text-sm transition-colors hover:border-neutral-600"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name ?? "User"} className="h-6 w-6 rounded-full object-cover" />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-lime-300 text-xs font-bold text-neutral-950">
            {name?.charAt(0).toUpperCase() ?? "U"}
          </div>
        )}
        <span className="hidden max-w-[120px] truncate text-neutral-300 sm:block">
          {name ?? email}
        </span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 text-neutral-500 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-[4px] border border-neutral-800 bg-[#111110] py-1 shadow-xl">
          <div className="border-b border-neutral-800 px-4 py-2.5">
            <p className="text-sm font-medium text-neutral-200 truncate">{name}</p>
            <p className="text-xs text-neutral-500 truncate">{email}</p>
          </div>
          <Link
            href={dashboardHref(role)}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
          >
            <DashboardIcon role={role} />
            {dashboardLabel(role)}
          </Link>
          <Link
            href="/dashboard/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
          >
            <User className="h-4 w-4" />
            Profil
          </Link>
          <div className="border-t border-neutral-800 mt-1 pt-1">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-neutral-800"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
