"use client";

import { useMemo, useState } from "react";
import { initialMatchPosts } from "@/data/matches";
import type { MatchPost, PlayerLevel } from "@/types";
import type { MatchPostFormValues } from "@/lib/validations";

export type MatchFilter = "all" | PlayerLevel;

const opponents = ["Rizky F.", "Dian K.", "Andi P.", "Nina S.", "Bagas R."];

export function useMatchmaking() {
  const [posts, setPosts] = useState<MatchPost[]>(initialMatchPosts);
  const [filter, setFilter] = useState<MatchFilter>("all");
  const [isFinding, setIsFinding] = useState(false);

  const filteredPosts = useMemo(
    () => posts.filter((post) => filter === "all" || post.level === filter),
    [filter, posts],
  );

  function postChallenge(values: MatchPostFormValues) {
    const post: MatchPost = {
      id: `match-${Date.now()}`,
      player: values.player,
      level: values.level,
      venueCourt: values.venueCourt,
      date: values.date,
      time: values.time,
      format: values.format,
    };

    setPosts((current) => [post, ...current]);
    setFilter("all");
    return post;
  }

  async function autoMatch(name: string | undefined, level: PlayerLevel) {
    setIsFinding(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    const opponent = opponents[Math.floor(Math.random() * opponents.length)];
    setIsFinding(false);
    return `${name || "Kamu"} vs ${opponent} - Level ${level}`;
  }

  return {
    autoMatch,
    filter,
    filteredPosts,
    isFinding,
    postChallenge,
    setFilter,
  };
}
