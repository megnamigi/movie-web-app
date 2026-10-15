import Link from "next/link";
import { ChevronRight, X } from "lucide-react";
import type { MovieGenre } from "@/lib/tmdb";

export const genreLabel = (name: string) => name === "Science Fiction" ? "Sci-Fi" : name;
export const genrePath = (ids: number[]) => ids.length ? `/genres?ids=${ids.join(",")}` : "/genres";

export default function GenreChips({ genres, selectedIds = [], multiple = false, onSelect }: {
  genres: MovieGenre[];
  selectedIds?: number[];
  multiple?: boolean;
  onSelect?: () => void;
}) {
  return <div className="flex flex-wrap gap-x-3 gap-y-4">
    {genres.map((genre) => {
      const selected = selectedIds.includes(genre.id);
      const ids = multiple ? selected ? selectedIds.filter((id) => id !== genre.id) : [...selectedIds, genre.id] : [genre.id];
      const Icon = selected ? X : ChevronRight;
      return <Link key={genre.id} href={genrePath(ids)} onClick={onSelect}
        aria-label={selected ? `Remove ${genreLabel(genre.name)} filter` : genreLabel(genre.name)}
        aria-current={selected ? "true" : undefined}
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold leading-4 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[current=true]:border-foreground aria-[current=true]:bg-foreground aria-[current=true]:text-background">
        {genreLabel(genre.name)}<Icon size={12} strokeWidth={1.5} aria-hidden="true" />
      </Link>;
    })}
  </div>;
}
