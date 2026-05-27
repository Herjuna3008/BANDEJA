"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface DashboardSidebarProps {
  items: NavItem[];
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
}

export function DashboardSidebar({
  items,
  userName,
  userEmail,
  userImage,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-neutral-800 bg-[#0d0d0b]">
      <div className="flex h-16 items-center border-b border-neutral-800 px-6">
        <Link
          href="/"
          className="font-display text-2xl uppercase tracking-[0.16em] text-lime-300"
        >
          BANDEJA
        </Link>
        <Zap className="ml-2 h-3.5 w-3.5 text-lime-300" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-lime-300/10 font-semibold text-lime-300"
                      : "text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-neutral-800 p-4">
        <div className="mb-3 flex items-center gap-3">
          {userImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={userImage}
              alt={userName ?? "User"}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-300/20 font-display text-sm text-lime-300">
              {userName?.charAt(0).toUpperCase() ?? "U"}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-200">{userName}</p>
            <p className="truncate text-xs text-neutral-600">{userEmail}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-2 rounded-[4px] px-3 py-2 text-sm text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
