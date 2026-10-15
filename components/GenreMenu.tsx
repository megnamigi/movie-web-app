"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LoaderCircle } from "lucide-react";
import useSWR from "swr";
import GenreChips from "@/components/GenreChips";
import type { MovieGenre } from "@/lib/tmdb";
import { usePopupPosition } from "@/lib/use-popup-position";

async function fetchGenres(url: string): Promise<MovieGenre[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not load genres.");
  return response.json();
}

export default function GenreMenu({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const { data, error, isLoading, mutate } = useSWR(open ? "/api/genres" : null, fetchGenres, { revalidateOnFocus: false });
  usePopupPosition(open, button, popup);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: Event) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); button.current?.focus(); }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("focusin", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("focusin", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return <div ref={container} className="shrink-0">
    <button ref={button} type="button" aria-label="Genre" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? "movie-genres" : undefined}
      onClick={() => setOpen(!open)} className={`flex h-9 items-center justify-center gap-2 rounded-md border border-border text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-auto sm:px-4 sm:py-2 ${compact ? "w-9 px-0 sm:w-auto" : "px-4"}`}>
      <ChevronDown size={16} aria-hidden="true" /><span className={compact ? "hidden sm:inline" : ""}>Genre</span>
    </button>
    {open && <div ref={popup} id="movie-genres" role="dialog" aria-labelledby="genre-heading" className="fixed z-50 overflow-y-auto rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-sm">
      <h2 id="genre-heading" className="text-2xl font-semibold tracking-tight">Genres</h2>
      <p className="mt-1 text-base">See lists of movies by genre</p>
      <hr className="my-4 border-border" />
      {isLoading && <div role="status" aria-label="Loading genres" className="flex justify-center p-4"><LoaderCircle className="animate-spin text-muted-foreground" /></div>}
      {error && <p role="alert" className="text-sm">Could not load genres. <button onClick={() => void mutate()} className="underline">Try again</button></p>}
      {data && <GenreChips genres={data} onSelect={() => setOpen(false)} />}
    </div>}
  </div>;
}
