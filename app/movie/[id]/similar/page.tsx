import { isAxiosError } from "axios";
import { notFound, redirect } from "next/navigation";
import MovieListPage from "@/components/MovieListPage";
import { getMovieDetails, getSimilarMovies } from "@/lib/tmdb";
import { MAX_MOVIE_PAGES, parseMoviePage } from "@/lib/pagination";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

export default async function SimilarMoviesPage({ params, searchParams }: Props) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) notFound();

  const query = await searchParams;
  const page = parseMoviePage(query.page, MAX_MOVIE_PAGES * 2);
  const [, response] = await Promise.all([
    getMovieDetails(id),
    getSimilarMovies(id, Math.ceil(page / 2)),
  ]).catch((error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 404) notFound();
    throw error;
  });
  const totalPages = Math.ceil(Math.min(response.total_results, response.total_pages * 20) / 10);
  const offset = (page - 1) % 2 * 10;
  const data = { ...response, page, total_pages: totalPages, results: response.results.slice(offset, offset + 10) };
  const basePath = `/movie/${id}/similar`;
  const lastPage = Math.max(1, Math.min(data.total_pages, MAX_MOVIE_PAGES * 2));

  if (page > lastPage) {
    redirect(lastPage === 1 ? basePath : `${basePath}?page=${lastPage}`);
  }

  return (
    <MovieListPage
      title="More like this"
      maxPages={MAX_MOVIE_PAGES * 2}
      data={data}
      basePath={basePath}
    />
  );
}
