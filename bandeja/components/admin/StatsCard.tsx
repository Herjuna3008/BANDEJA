"use client";

import {
  CalendarDays, Building2, Users, TrendingUp, Trophy, Swords, CheckCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  "calendar-days": CalendarDays,
  "building": Building2,
  "users": Users,
  "trending-up": TrendingUp,
  "trophy": Trophy,
  "swords": Swords,
  "check-circle": CheckCircle,
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  description?: string;
  accent?: boolean;
}

export function StatsCard({ title, value, icon, description, accent }: StatsCardProps) {
  const Icon = ICON_MAP[icon];

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
            {title}
          </p>
          <p
            className={cn(
              "mt-2 font-display text-5xl leading-none",
              accent ? "text-lime-300" : "text-neutral-100",
            )}
          >
            {value}
          </p>
          {description && (
            <p className="mt-2 text-xs text-neutral-600">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="rounded-[4px] border border-neutral-800 p-2.5">
            <Icon className="h-5 w-5 text-neutral-500" />
          </div>
        )}
      </div>
    </Card>
  );
}
