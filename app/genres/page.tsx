import { redirect } from "next/navigation";
import GenreChips, { genreLabel, genrePath } from "@/components/GenreChips";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import { getMovieGenres, getMoviesByGenre } from "@/lib/tmdb";
import { MAX_MOVIE_PAGES, parseMoviePage } from "@/lib/pagination";

type Props = { searchParams: Promise<{ ids?: string | string[]; page?: string | string[] }> };
export default async function GenresPage({ searchParams }: Props) {
  const params = await searchParams;
  const genres = await getMovieGenres();
  const requested = typeof params.ids === "string" ? params.ids.split(",").filter((id) => /^[1-9]\d*$/.test(id)).map(Number) : [];
  const ids = [...new Set(requested)].filter((id) => genres.some((genre) => genre.id === id));
  const labels = ids.map((id) => genreLabel(genres.find((genre) => genre.id === id)!.name));
  const page = parseMoviePage(params.page);
  const data = await getMoviesByGenre(ids, page);
  const basePath = genrePath(ids);
  const last = Math.max(1, Math.min(data.total_pages, MAX_MOVIE_PAGES));
  if (page > last) redirect(last === 1 ? basePath : `${basePath}${ids.length ? "&" : "?"}page=${last}`);
  return <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-20">
    <h1 className="mb-8 text-3xl font-semibold tracking-tight">Search filter</h1>
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <aside className="border-b border-border pb-8 lg:border-b-0 lg:border-r lg:pr-8 lg:pb-0">
        <h2 className="text-2xl font-semibold tracking-tight">Genres</h2>
        <p className="mb-6 mt-1">See lists of movies by genre</p>
        <GenreChips genres={genres} selectedIds={ids} multiple />
      </aside>
      <section aria-label="Filtered movies">
        <h2 className="mb-8 text-xl font-semibold">{data.total_results.toLocaleString("en-US")} titles{labels.length ? ` in “${labels.join(", ")}”` : " in all genres"}</h2>
        {data.results.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">{data.results.map((movie) => <MovieCard key={movie.id} movie={movie} />)}</div> : <div className="flex min-h-24 items-center justify-center rounded-lg border border-border p-6 text-sm">No results found. Try another combination of genres.</div>}
        <Pagination currentPage={data.page} totalPages={data.total_pages} basePath={basePath} />
      </section>
    </div>
  </main>;
}
