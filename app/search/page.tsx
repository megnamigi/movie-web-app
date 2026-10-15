import { redirect } from "next/navigation";
import MovieListPage from "@/components/MovieListPage";
import { searchMovies, type MovieListResponse } from "@/lib/tmdb";
import { MAX_MOVIE_PAGES, parseMoviePage } from "@/lib/pagination";

type Props = {
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const page = parseMoviePage(params.page);
  const data: MovieListResponse = query
    ? await searchMovies(query, page)
    : { page: 1, results: [], total_pages: 0, total_results: 0 };
  const basePath = query ? `/search?q=${encodeURIComponent(query)}` : "/search";
  const lastPage = Math.max(1, Math.min(data.total_pages, MAX_MOVIE_PAGES));
  if (page > lastPage) {
    redirect(lastPage === 1 ? basePath : `${basePath}&page=${lastPage}`);
  }
  return (
    <MovieListPage
      title={query ? `Search results for "${query}"` : "Search Movies"}
      data={data}
      basePath={basePath}
      emptyMessage={query ? "No movies found. Try another movie name." : "Enter a movie name to search."}
    />
  );
}
