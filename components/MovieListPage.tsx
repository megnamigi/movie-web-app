import Link from "next/link";
import Pagination from "@/components/Pagination";
import MovieCard from "@/components/MovieCard";
import { MAX_MOVIE_PAGES } from "@/lib/pagination";
import type { MovieListResponse } from "@/lib/tmdb";

type Props = {
  title: string;
  maxPages?: number;
  data: MovieListResponse;
  basePath: string;
  emptyMessage?: string;
  backLink?: { href: string; label: string };
};

export default function MovieListPage({ title, data, basePath, backLink, maxPages = MAX_MOVIE_PAGES, emptyMessage = "No movies found." }: Props) {
  const totalPages = Math.min(data.total_pages, maxPages);

  return (
    <>
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-8 sm:px-6 sm:py-12">
        {backLink && (
          <Link href={backLink.href} className="mb-6 inline-block text-sm text-indigo-600 hover:underline dark:text-indigo-400">
            ← {backLink.label}
          </Link>
        )}
        <h1 className="mb-8 text-2xl font-semibold">{title}</h1>
        {data.results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5 lg:gap-8">
              {data.results.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
            </div>
            <Pagination maxPages={maxPages} currentPage={data.page} totalPages={totalPages} basePath={basePath} />
          </>
        ) : (
          <p className="text-muted-foreground">{emptyMessage}</p>
        )}
      </main>
    </>
  );
}
