"use client";

import { useState } from "react";
import { Swords, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { MatchPost } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { levelLabel } from "@/lib/utils";

export function MatchesClient({ posts: initialPosts }: { posts: MatchPost[] }) {
  const [posts, setPosts] = useState(initialPosts);

  async function handleClose(id: string) {
    try {
      const res = await fetch(`/api/matchmaking/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOpen: false }),
      });
      if (!res.ok) throw new Error();
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, isOpen: false } : p)));
      toast.success("Post ditutup.");
    } catch {
      toast.error("Gagal menutup post.");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/matchmaking/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post dihapus.");
    } catch {
      toast.error("Gagal menghapus post.");
    }
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-[4px] border border-neutral-800 p-12 text-center text-neutral-500">
        Belum ada match post.{" "}
        <a href="/matchmaking" className="text-lime-300 hover:underline">
          Post tantangan →
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {posts.map((post) => (
        <Card key={post.id} className="p-5">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <Swords className="h-4 w-4 text-lime-300" />
              <span className="font-bold text-neutral-100">{post.format}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={post.level === "beginner" ? "teal" : post.level === "advanced" ? "orange" : "lime"}>
                {levelLabel(post.level)}
              </Badge>
              {!post.isOpen && (
                <span className="rounded-full bg-neutral-800 px-2 py-0.5 font-mono text-[10px] uppercase text-neutral-500">
                  Ditutup
                </span>
              )}
            </div>
          </div>

          <div className="mb-4 text-sm text-neutral-500 space-y-1">
            <p>Venue: <span className="text-neutral-200">{post.venueCourt}</span></p>
            <p>Tanggal: <span className="text-neutral-200">{post.date}</span> — Jam: <span className="text-neutral-200">{post.time}</span></p>
          </div>

          <div className="flex gap-2">
            {post.isOpen && (
              <Button size="sm" variant="secondary" onClick={() => handleClose(post.id)}>
                Tutup Post
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="text-red-400 hover:text-red-300"
              onClick={() => handleDelete(post.id)}
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
