"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, Search } from "lucide-react";
import useSWR from "swr";
import type { MovieListResponse } from "@/lib/tmdb";
import { usePopupPosition } from "@/lib/use-popup-position";

type Suggestions = Pick<MovieListResponse, "results" | "total_results">;
async function fetchSuggestions(url: string): Promise<Suggestions> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Search is unavailable.");
  return response.json();
}
export default function SearchBox({ anchorRef, mobileExpanded = false, onNavigate, onEscape }: { anchorRef: RefObject<HTMLDivElement | null>; mobileExpanded?: boolean; onNavigate?: () => void; onEscape?: () => void }) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const container = useRef<HTMLDivElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (mobileExpanded) inputRef.current?.focus();
  }, [mobileExpanded]);
  const query = input.trim();
  const visible = open && query.length > 0;
  const ready = query === debounced;
  const { data, error, isLoading, mutate } = useSWR(visible && ready ? `/api/search?q=${encodeURIComponent(query)}` : null, fetchSuggestions, { revalidateOnFocus: false, shouldRetryOnError: false });
  const results = ready ? data?.results ?? [] : [];
  const loading = !ready || isLoading;
  const resultsPath = `/search?q=${encodeURIComponent(query)}`;
  usePopupPosition(visible, anchorRef, popup, true);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);
  useEffect(() => {
    if (!visible) return;
    const dismiss = (event: Event) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("focusin", dismiss);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("focusin", dismiss);
    };
  }, [visible]);
  const close = () => { setOpen(false); setActive(-1); };
  const navigate = () => { close(); onNavigate?.(); };
  return <div ref={container} className="min-w-0 flex-1 sm:max-w-[379px]">
    <form role="search" onSubmit={(event) => {
      event.preventDefault();
      if (!query) return;
      router.push(visible && results[active] ? `/movie/${results[active].id}` : resultsPath);
      navigate();
    }} className="flex items-center gap-2 rounded-md border-border px-2 py-2 sm:border sm:px-3 sm:focus-within:ring-2 sm:focus-within:ring-ring">
      <button type="submit" aria-label="Search movies"><Search size={17} className="text-muted-foreground" /></button>
      <input ref={inputRef} value={input} onChange={(event) => { setInput(event.target.value); setOpen(true); setActive(-1); }}
        onFocus={() => setOpen(true)} onKeyDown={(event) => {
          if (event.key === "Escape") { close(); onEscape?.(); return; }
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault(); setOpen(true);
            if (results.length) setActive((index) => (index + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
          }
        }} role="combobox" aria-label="Search movies" aria-autocomplete="list" aria-expanded={visible}
        aria-controls={visible ? "movie-suggestions" : undefined} aria-activedescendant={visible && results[active] ? `suggestion-${results[active].id}` : undefined}
        placeholder="Search..." autoComplete="off" className="w-full min-w-0 bg-transparent text-sm outline-none" />
    </form>
    {visible && <div ref={popup} className="fixed z-50 overflow-y-auto rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-sm">
      <div id="movie-suggestions" role="listbox" aria-label="Movie suggestions" aria-busy={loading}>
        {loading ? <div role="status" aria-label="Searching movies" className="flex min-h-28 items-center justify-center"><LoaderCircle size={36} strokeWidth={2} className="animate-spin text-muted-foreground/50" /></div>
          : error ? <div role="alert" className="py-9 text-center text-sm">Search is unavailable. <button type="button" onClick={() => void mutate()} className="underline">Try again</button></div>
          : results.length === 0 ? <p role="status" className="py-9 text-center text-sm">No results found.</p>
          : results.map((movie, index) => <Link key={movie.id} id={`suggestion-${movie.id}`} role="option" aria-selected={active === index} href={`/movie/${movie.id}`} onClick={navigate}
            className="flex gap-4 border-b border-border px-1 py-4 first:pt-1 hover:bg-muted aria-selected:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {movie.poster_path ? <img src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`} alt="" width={64} height={96} className="h-24 w-16 shrink-0 rounded-md object-cover" /> : <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-md bg-muted text-center text-xs text-muted-foreground">No poster</div>}
            <div className="flex min-w-0 flex-1 flex-col">
              <h3 className="line-clamp-2 text-base font-semibold leading-5 sm:text-xl sm:leading-6">{movie.title}</h3>
              <p className="text-sm"><span className="text-yellow-400">★</span> {movie.vote_average.toFixed(1)}<span className="text-muted-foreground">/10</span></p>
              <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-sm"><span>{movie.release_date?.slice(0, 4) || "TBA"}</span><span className="flex shrink-0 items-center gap-2">See more <ArrowRight size={16} aria-hidden="true" /></span></div>
            </div>
          </Link>)}
      </div>
      {!loading && !error && results.length > 0 && <Link href={resultsPath} onClick={navigate} className="block rounded-md px-3 pb-1 pt-4 text-sm hover:underline">See all results for &quot;{query}&quot;</Link>}
    </div>}
  </div>;
}
