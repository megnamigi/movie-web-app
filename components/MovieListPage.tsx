import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import { MAX_MOVIE_PAGES } from "@/lib/pagination";
import type { MovieListResponse } from "@/lib/tmdb";

type Props = {
  title: string;
  data: MovieListResponse;
  basePath: string;
  emptyMessage?: string;
  backLink?: { href: string; label: string };
};

function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const pages = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages])]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
  const pageHref = (page: number) => page === 1 ? basePath : `${basePath}${basePath.includes("?") ? "&" : "?"}page=${page}`;
  const linkClass = "rounded-md border border-border px-3 py-2 text-sm hover:bg-muted";

  return (
    <nav aria-label="Movie list pages" className="mt-10 flex flex-wrap justify-center gap-2">
      {currentPage > 1 && (
        <Link href={pageHref(currentPage - 1)} className={linkClass}>
          ← Previous
        </Link>
      )}
      {pages.map((page, index) => (
        <span key={page} className="flex items-center gap-2">
          {index > 0 && page - pages[index - 1] > 1 && (
            <span className="px-1 text-muted-foreground">…</span>
          )}
          {page === currentPage ? (
            <span aria-current="page" aria-label={`Page ${page}`} className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white">
              {page}
            </span>
          ) : (
            <Link href={pageHref(page)} aria-label={`Page ${page}`} className={linkClass}>
              {page}
            </Link>
          )}
        </span>
      ))}
      {currentPage < totalPages && (
        <Link href={pageHref(currentPage + 1)} className={linkClass}>
          Next →
        </Link>
      )}
    </nav>
  );
}

export default function MovieListPage({ title, data, basePath, backLink, emptyMessage = "No movies found." }: Props) {
  const totalPages = Math.min(data.total_pages, MAX_MOVIE_PAGES);

  return (
    <>
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 sm:px-6 sm:py-12">
        {backLink && (
          <Link href={backLink.href} className="mb-6 inline-block text-sm text-indigo-600 hover:underline dark:text-indigo-400">
            ← {backLink.label}
          </Link>
        )}
        <h1 className="mb-8 text-2xl font-semibold">{title}</h1>
        {data.results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5 lg:gap-8">
              {data.results.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
            </div>
            <Pagination currentPage={data.page} totalPages={totalPages} basePath={basePath} />
          </>
        ) : (
          <p className="text-muted-foreground">{emptyMessage}</p>
        )}
      </main>
    </>
  );
}
