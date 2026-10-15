import { redirect } from "next/navigation";
import MovieCard from "@/components/MovieCard";
import GenreChips from "@/components/GenreChips";
import Pagination from "@/components/Pagination";
import { getMovieGenres, searchMovies, type MovieListResponse } from "@/lib/tmdb";
import { MAX_MOVIE_PAGES, parseMoviePage } from "@/lib/pagination";

type Props = { searchParams: Promise<{ q?: string | string[]; page?: string | string[] }> };
export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const page = parseMoviePage(params.page);
  const empty: MovieListResponse = { page: 1, results: [], total_pages: 0, total_results: 0 };
  const [data, genres] = await Promise.all([query ? searchMovies(query, page) : Promise.resolve(empty), getMovieGenres()]);
  const basePath = query ? `/search?q=${encodeURIComponent(query)}` : "/search";
  const last = Math.max(1, Math.min(data.total_pages, MAX_MOVIE_PAGES));
  if (page > last) redirect(last === 1 ? basePath : `${basePath}${query ? "&" : "?"}page=${last}`);
  return <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-8 sm:px-6 sm:py-12 lg:px-20">
    <h1 className="mb-8 text-2xl sm:text-3xl font-semibold tracking-tight">Search results</h1>
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-10">
      <section aria-label="Search results">
        <h2 className="mb-8 text-lg sm:text-xl font-semibold">{query ? `${data.total_results.toLocaleString("en-US")} results for “${query}”` : "Enter a movie name to search."}</h2>
        {data.results.length ? <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">{data.results.map((movie) => <MovieCard key={movie.id} movie={movie} />)}</div> : <div className="flex min-h-24 items-center justify-center rounded-lg border border-border p-6 text-center text-sm">No results found.</div>}
        <Pagination currentPage={data.page} totalPages={data.total_pages} basePath={basePath} />
      </section>
      <aside className="border-border lg:border-l lg:pl-10">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Search by genre</h2>
        <p className="mb-6 mt-1 text-sm sm:text-base">See lists of movies by genre</p>
        <GenreChips genres={genres} />
      </aside>
    </div>
  </main>;
}
