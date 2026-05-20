"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search, Swords, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
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
import { availableCourtOptions } from "@/data/venues";
import type { MatchFilter } from "@/hooks/useMatchmaking";
import type { MatchPost } from "@/types";
import {
  autoMatchSchema,
  matchPostSchema,
  type AutoMatchFormValues,
  type MatchPostFormValues,
} from "@/lib/validations";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { cn, levelLabel } from "@/lib/utils";

interface MatchmakingSectionProps {
  filter: MatchFilter;
  isFinding: boolean;
  posts: MatchPost[];
  onAcceptChallenge: (name: string) => void;
  onAutoMatch: (values: AutoMatchFormValues) => Promise<void>;
  onFilterChange: (filter: MatchFilter) => void;
  onPostChallenge: (values: MatchPostFormValues) => void;
}

const filterOptions: { label: string; value: MatchFilter }[] = [
  { label: "Semua", value: "all" },
  { label: "Pemula", value: "beginner" },
  { label: "Menengah", value: "intermediate" },
];

export function MatchmakingSection({
  filter,
  isFinding,
  onAcceptChallenge,
  onAutoMatch,
  onFilterChange,
  onPostChallenge,
  posts,
}: MatchmakingSectionProps) {
  const postForm = useForm<MatchPostFormValues>({
    resolver: zodResolver(matchPostSchema),
    defaultValues: {
      player: "",
      level: "intermediate",
      venueCourt: "",
      date: "",
      time: "",
      format: "Singles (1v1)",
    },
  });
  const autoForm = useForm<AutoMatchFormValues>({
    resolver: zodResolver(autoMatchSchema),
    defaultValues: { name: "", level: "beginner", venue: "Mana saja" },
  });

  function submitPost(values: MatchPostFormValues) {
    onPostChallenge(values);
    postForm.reset({
      player: "",
      level: "intermediate",
      venueCourt: "",
      date: "",
      time: "",
      format: "Singles (1v1)",
    });
  }

  return (
    <section id="match" className="bg-[#111110] px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading label="// 03 - Cari & Tantang Lawan" title={"Temukan\nLawanmu"} />
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
          <div>
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-neutral-500">Player yang mencari lawan main</p>
              <div className="flex flex-wrap gap-2" aria-label="Filter matchmaking">
                {filterOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    size="sm"
                    variant={filter === option.value ? "default" : "secondary"}
                    onClick={() => onFilterChange(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {posts.length === 0 ? (
              <Card className="p-8 text-center text-sm text-neutral-500">
                Belum ada tantangan untuk filter ini.
              </Card>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-120px" }}
                className="grid gap-4"
              >
                {posts.map((post) => (
                  <motion.div key={post.id} variants={fadeUp}>
                    <Card className="p-5 transition-colors hover:border-orange-400">
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2 font-bold">
                          <UserRound className="h-4 w-4 text-lime-300" />
                          {post.player}
                        </div>
                        <Badge
                          variant={
                            post.level === "beginner"
                              ? "teal"
                              : post.level === "advanced"
                                ? "orange"
                                : "lime"
                          }
                        >
                          {levelLabel(post.level)}
                        </Badge>
                      </div>
                      <p className="mb-4 text-sm leading-6 text-neutral-500">
                        Venue: <span className="font-medium text-neutral-200">{post.venueCourt}</span>
                        <br />
                        Tanggal: <span className="font-medium text-neutral-200">{post.date}</span>{" "}
                        - Jam: <span className="font-medium text-neutral-200">{post.time}</span>
                        <br />
                        Format: <span className="font-medium text-neutral-200">{post.format}</span>
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onAcceptChallenge(post.player)}
                        >
                          <Swords className="h-4 w-4" />
                          Tantang
                        </Button>
                        <Button size="sm" variant="secondary">
                          Lihat Profil
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
                  onValueChange={(value) =>
                    postForm.setValue("level", value as MatchPostFormValues["level"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Pemula</SelectItem>
                    <SelectItem value="intermediate">Menengah</SelectItem>
                    <SelectItem value="advanced">Pro</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField
                label="Venue & Court"
                error={postForm.formState.errors.venueCourt?.message}
              >
                <Select onValueChange={(value) => postForm.setValue("venueCourt", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCourtOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
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
              <FormField label="Format" error={postForm.formState.errors.format?.message}>
                <Select
                  defaultValue="Singles (1v1)"
                  onValueChange={(value) =>
                    postForm.setValue("format", value as MatchPostFormValues["format"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Singles (1v1)">Singles (1v1)</SelectItem>
                    <SelectItem value="Doubles (2v2)">Doubles (2v2)</SelectItem>
                    <SelectItem value="Fleksibel">Fleksibel</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <Button type="submit" className="w-full">
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
            onSubmit={autoForm.handleSubmit(onAutoMatch)}
          >
            <FormField label="Nama">
              <Input placeholder="Nama kamu" {...autoForm.register("name")} />
            </FormField>
            <FormField label="Level">
              <Select
                defaultValue="beginner"
                onValueChange={(value) =>
                  autoForm.setValue("level", value as AutoMatchFormValues["level"])
                }
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
            <FormField label="Venue">
              <Select
                defaultValue="Mana saja"
                onValueChange={(value) => autoForm.setValue("venue", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mana saja">Mana saja</SelectItem>
                  <SelectItem value="BANDEJA SOUTH">BANDEJA SOUTH</SelectItem>
                  <SelectItem value="BANDEJA NORTH">BANDEJA NORTH</SelectItem>
                  <SelectItem value="BANDEJA WEST">BANDEJA WEST</SelectItem>
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
