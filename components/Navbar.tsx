"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Moon, Sun, Film, Search, X } from "lucide-react";
import GenreMenu from "@/components/GenreMenu";
import SearchBox from "@/components/SearchBox";
import { useDarkMode } from "@/lib/theme";

export default function Navbar() {
  const { darkMode, toggleTheme } = useDarkMode();
  const [mobileSearch, setMobileSearch] = useState(false);
  const controls = useRef<HTMLDivElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const closeSearch = () => { setMobileSearch(false); searchButton.current?.focus(); };
  return <header className="w-full border-b border-border bg-background">
    <nav className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-3 px-5 sm:h-auto sm:gap-6 sm:px-6 sm:py-3 lg:px-20">
      <Link href="/" className={`${mobileSearch ? "hidden sm:flex" : "flex"} shrink-0 items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400`}><Film size={20} strokeWidth={1.8} className="sm:h-6 sm:w-6" /><span className="font-bold italic">Movie Z</span></Link>
      <div ref={controls} className={`${mobileSearch ? "flex" : "hidden sm:flex"} min-w-0 flex-1 items-center gap-3 sm:max-w-[500px]`}>
        <GenreMenu compact /><SearchBox anchorRef={controls} mobileExpanded={mobileSearch} onNavigate={() => setMobileSearch(false)} onEscape={closeSearch} />
        <button type="button" onClick={closeSearch} aria-label="Close search" className="flex h-9 w-7 shrink-0 items-center justify-center text-muted-foreground sm:hidden"><X size={18} /></button>
      </div>
      <div className={`${mobileSearch ? "hidden sm:flex" : "flex"} items-center gap-3`}>
        <button ref={searchButton} type="button" onClick={() => setMobileSearch(true)} aria-label="Open search" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted sm:hidden"><Search size={16} /></button>
        <button type="button" onClick={toggleTheme} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border hover:bg-muted sm:h-10 sm:w-10" aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>{darkMode ? <Sun size={16} /> : <Moon size={16} />}</button>
      </div>
    </nav>
  </header>;
}
