"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Moon, Sun, ChevronDown, Clapperboard } from "lucide-react";

import { Film } from "lucide-react";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [showGenres, setShowGenres] = useState(false);
  const [search, setSearch] = useState("");

  const router = useRouter();

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Drama",
    "Fantasy",
    "Horror",
    "Romance",
    "Science Fiction",
    "Thriller",
  ];

  return (
    <header className="w-full h-[59px] border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-6 px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-indigo-600"
        >
          <Film size={24} strokeWidth={1.8} />
            <span className="font-sans italic font-bold">
                Movie Z
            </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowGenres(!showGenres)}
              className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-800"
            >
              <ChevronDown size={16} />
              Genre
            </button>

            {showGenres && (
              <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-lg border bg-white p-2 shadow-lg">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setShowGenres(false)}
                    className="block w-full rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {genre}
                  </button>
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
            className="flex w-72 items-center gap-2 rounded-md border border-gray-200 px-3 py-2"
          >
            <button type="submit" aria-label="Search movies">
              <Search size={17} className="text-gray-400" />
            </button>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent text-sm text-gray-800 outline-none"
            />
          </form>
        </div>
        
        <button
          onClick={() => {
            const next = !darkMode;
            setDarkMode(next);
            document.documentElement.classList.toggle("dark", next);
          }}
          className="rounded-lg border border-gray-200 p-2 text-gray-700"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>
    </header>
  );
}
