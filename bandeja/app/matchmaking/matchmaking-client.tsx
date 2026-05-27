"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search, Swords, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Court, MatchPost, Venue } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/shared/FormField";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Separator } from "@/components/ui/separator";
import { matchPostSchema, type MatchPostFormValues, autoMatchSchema, type AutoMatchFormValues } from "@/lib/validations";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { cn, levelLabel } from "@/lib/utils";

type PostWithUser = MatchPost & { user: { name: string | null; image: string | null } };
type VenueWithCourts = Venue & { courts: Court[] };

interface Props {
  initialPosts: PostWithUser[];
  venues: VenueWithCourts[];
  userId: string;
  userName: string;
}

type FilterLevel = "all" | "beginner" | "intermediate" | "advanced";

const filterOptions: { label: string; value: FilterLevel }[] = [
  { label: "Semua", value: "all" },
  { label: "Pemula", value: "beginner" },
  { label: "Menengah", value: "intermediate" },
  { label: "Pro", value: "advanced" },
];

export function MatchmakingClient({ initialPosts, venues, userName }: Props) {
  const [posts, setPosts] = useState<PostWithUser[]>(initialPosts);
  const [filter, setFilter] = useState<FilterLevel>("all");
  const [isFinding, setIsFinding] = useState(false);

  const courtOptions = venues.flatMap((v) =>
    v.courts
      .filter((c) => c.status === "AVAILABLE")
      .map((c) => `${v.name} - ${c.name}`),
  );

  const postForm = useForm<MatchPostFormValues>({
    resolver: zodResolver(matchPostSchema),
    defaultValues: {
      player: userName,
      level: "intermediate",
      venueCourt: "",
      date: "",
      time: "",
      format: "Singles (1v1)",
    },
  });
  const autoForm = useForm<AutoMatchFormValues>({
    resolver: zodResolver(autoMatchSchema),
    defaultValues: { name: userName, level: "beginner", venue: "Mana saja" },
  });

  const filtered = filter === "all" ? posts : posts.filter((p) => p.level === filter);

  async function submitPost(values: MatchPostFormValues) {
    try {
      const res = await fetch("/api/matchmaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: values.level,
          venueCourt: values.venueCourt,
          date: values.date,
          time: values.time,
          format: values.format,
        }),
      });
      if (!res.ok) throw new Error();
      const newPost = await res.json();
      setPosts((prev) => [newPost, ...prev]);
      toast.success(`Tantangan ${values.player} berhasil dipost!`);
      postForm.reset({ player: userName, level: "intermediate", venueCourt: "", date: "", time: "", format: "Singles (1v1)" });
    } catch {
      toast.error("Gagal posting tantangan. Coba lagi.");
    }
  }

  async function handleAutoMatch(values: AutoMatchFormValues) {
    setIsFinding(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsFinding(false);
    const matching = posts.filter((p) => p.level === values.level && p.isOpen);
    if (matching.length === 0) {
      toast.info("Belum ada lawan yang cocok, coba lagi nanti.");
    } else {
      toast.success(`Match ditemukan: ${matching[0].user.name}! Cek tantangan di bawah.`);
    }
  }

  async function handleAccept(post: PostWithUser) {
    toast.success(`Tantangan terkirim ke ${post.user.name}. Tunggu konfirmasi!`);
  }

  return (
    <section className="bg-[#111110] px-5 py-16 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeading label="// 03 - Cari & Tantang Lawan" title={"Temukan\nLawanmu"} />

        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
          <div>
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-neutral-500">Player yang mencari lawan main</p>
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    size="sm"
                    variant={filter === opt.value ? "default" : "secondary"}
                    onClick={() => setFilter(opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <Card className="p-8 text-center text-sm text-neutral-500">
                Belum ada tantangan. Jadilah yang pertama posting!
              </Card>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid gap-4"
              >
                {filtered.map((post) => (
                  <motion.div key={post.id} variants={fadeUp}>
                    <Card className="p-5 transition-colors hover:border-orange-400">
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2 font-bold">
                          {post.user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={post.user.image} alt="" className="h-5 w-5 rounded-full" />
                          ) : (
                            <UserRound className="h-4 w-4 text-lime-300" />
                          )}
                          {post.user.name}
                        </div>
                        <Badge
                          variant={
                            post.level === "beginner" ? "teal" : post.level === "advanced" ? "orange" : "lime"
                          }
                        >
                          {levelLabel(post.level)}
                        </Badge>
                      </div>
                      <p className="mb-4 text-sm leading-6 text-neutral-500">
                        Venue: <span className="font-medium text-neutral-200">{post.venueCourt}</span>
                        <br />
                        Tanggal:{" "}
                        <span className="font-medium text-neutral-200">{post.date}</span> — Jam:{" "}
                        <span className="font-medium text-neutral-200">{post.time}</span>
                        <br />
                        Format: <span className="font-medium text-neutral-200">{post.format}</span>
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="destructive" onClick={() => handleAccept(post)}>
                          <Swords className="h-4 w-4" />
                          Tantang
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          <Card className="h-fit p-8 lg:sticky lg:top-28">
            <h3 className="mb-6 font-display text-3xl uppercase tracking-[0.08em]">
              Posting Tantangan
            </h3>
            <form className="grid gap-5" onSubmit={postForm.handleSubmit(submitPost)}>
              <FormField label="Nama Kamu" error={postForm.formState.errors.player?.message}>
                <Input placeholder="e.g. Ahmad Fariz" {...postForm.register("player")} />
              </FormField>
              <FormField label="Level" error={postForm.formState.errors.level?.message}>
                <Select
                  defaultValue="intermediate"
                  onValueChange={(v) => postForm.setValue("level", v as MatchPostFormValues["level"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Pemula</SelectItem>
                    <SelectItem value="intermediate">Menengah</SelectItem>
                    <SelectItem value="advanced">Pro</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Venue & Court" error={postForm.formState.errors.venueCourt?.message}>
                <Select onValueChange={(v) => postForm.setValue("venueCourt", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {courtOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Tanggal" error={postForm.formState.errors.date?.message}>
                  <Input type="date" {...postForm.register("date")} />
                </FormField>
                <FormField label="Jam" error={postForm.formState.errors.time?.message}>
                  <Input type="time" {...postForm.register("time")} />
                </FormField>
              </div>
              <FormField label="Format">
                <Select
                  defaultValue="Singles (1v1)"
                  onValueChange={(v) => postForm.setValue("format", v as MatchPostFormValues["format"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Singles (1v1)">Singles (1v1)</SelectItem>
                    <SelectItem value="Doubles (2v2)">Doubles (2v2)</SelectItem>
                    <SelectItem value="Fleksibel">Fleksibel</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <Button type="submit">
                <Swords className="h-4 w-4" />
                Post Tantangan
              </Button>
            </form>
          </Card>
        </div>

        <Separator className="my-14" />

        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-lime-300">
            {"// Auto Matchmaking"}
          </p>
          <h3 className="mb-6 font-display text-4xl uppercase tracking-[0.06em]">
            Cariin Lawan Otomatis
          </h3>
          <form
            className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]"
            onSubmit={autoForm.handleSubmit(handleAutoMatch)}
          >
            <FormField label="Nama">
              <Input placeholder="Nama kamu" {...autoForm.register("name")} />
            </FormField>
            <FormField label="Level">
              <Select
                defaultValue="beginner"
                onValueChange={(v) => autoForm.setValue("level", v as AutoMatchFormValues["level"])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Pemula</SelectItem>
                  <SelectItem value="intermediate">Menengah</SelectItem>
                  <SelectItem value="advanced">Pro</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Venue">
              <Select defaultValue="Mana saja" onValueChange={(v) => autoForm.setValue("venue", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mana saja">Mana saja</SelectItem>
                  {venues.map((v) => (
                    <SelectItem key={v.id} value={v.name}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <div className="flex items-end">
              <Button type="submit" className={cn("w-full lg:w-auto")} disabled={isFinding}>
                {isFinding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Cariin Lawan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
