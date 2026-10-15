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
  const page = parseMoviePage(query.page);
  const [movie, data] = await Promise.all([
    getMovieDetails(id),
    getSimilarMovies(id, page),
  ]).catch((error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 404) notFound();
    throw error;
  });
  const basePath = `/movie/${id}/similar`;
  const lastPage = Math.max(1, Math.min(data.total_pages, MAX_MOVIE_PAGES));

  if (page > lastPage) {
    redirect(lastPage === 1 ? basePath : `${basePath}?page=${lastPage}`);
  }

  return (
    <MovieListPage
      title={`More like ${movie.title}`}
      data={data}
      basePath={basePath}
      backLink={{ href: `/movie/${id}`, label: "Back to movie" }}
    />
  );
}
