"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Moon, Sun, ChevronDown } from "lucide-react";
import useSWR from "swr";
import type { MovieGenre } from "@/lib/tmdb";
import { useDarkMode } from "@/lib/theme";

import { Film } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

async function fetchGenres(url: string): Promise<MovieGenre[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not load genres.");
  return response.json();
}

export default function Navbar() {
  const { darkMode, toggleTheme } = useDarkMode();
  const [showGenres, setShowGenres] = useState(false);
  const [search, setSearch] = useState("");
  const genreMenuRef = useRef<HTMLDivElement>(null);
  const genreButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { data: genres, error, isLoading, mutate } = useSWR<MovieGenre[]>(
    showGenres ? "/api/genres" : null,
    fetchGenres,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const router = useRouter();

  useEffect(() => {
    if (!showGenres) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !genreMenuRef.current?.contains(event.target)) {
        setShowGenres(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowGenres(false);
        genreButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showGenres]);

  return (
    <header className="w-full border-b border-border bg-background">
      <nav className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400"
        >
          <Film size={24} strokeWidth={1.8} />
            <span className="font-sans italic font-bold">
                Movie Z
            </span>
        </Link>

        <div className="order-3 flex w-full min-w-0 items-center gap-3 sm:order-none sm:w-auto sm:flex-1 sm:justify-center sm:gap-4">
          <div
            ref={genreMenuRef}
            className="relative shrink-0"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setShowGenres(false);
            }}
          >
            <button
              ref={genreButtonRef}
              id="genre-toggle"
              type="button"
              aria-expanded={showGenres}
              aria-controls="movie-genres"
              onClick={() => setShowGenres((open) => !open)}
              className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-foreground"
            >
              <ChevronDown size={16} />
              Genre
            </button>

            {showGenres && (
              <div
                id="movie-genres"
                role="region"
                aria-labelledby="genre-toggle"
                className="absolute left-0 top-full z-50 mt-2 max-h-80 w-56 overflow-y-auto rounded-lg border bg-popover p-2 text-popover-foreground shadow-lg"
              >
                {isLoading && <p role="status" className="px-3 py-2 text-sm text-muted-foreground">Loading genres…</p>}
                {error && (
                  <div role="alert" className="px-3 py-2 text-sm text-muted-foreground">
                    <p>Could not load genres.</p>
                    <button type="button" onClick={() => void mutate()} className="mt-2 text-indigo-600 underline dark:text-indigo-400">
                      Try again
                    </button>
                  </div>
                )}
                {genres?.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/genre/${genre.id}`}
                    aria-current={pathname === `/genre/${genre.id}` ? "page" : undefined}
                    onClick={() => setShowGenres(false)}
                    className="block w-full rounded px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted aria-[current=page]:bg-indigo-50 aria-[current=page]:text-indigo-600 dark:aria-[current=page]:bg-indigo-950 dark:aria-[current=page]:text-indigo-300"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
    
          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (search.trim()) {
                router.push(
                  `/search?q=${encodeURIComponent(search.trim())}`
                );
              }
            }}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-border px-3 py-2 sm:max-w-72"
          >
            <button type="submit" aria-label="Search movies">
              <Search size={17} className="text-muted-foreground" />
            </button>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              aria-label="Search movies"
              className="min-w-0 w-full bg-transparent text-sm text-foreground outline-none"
            />
          </form>
        </div>
        
        <button
          onClick={toggleTheme}
          className="shrink-0 rounded-lg border border-border p-2 text-foreground hover:bg-muted"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>
    </header>
  );
}
