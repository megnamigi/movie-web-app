import { notFound, redirect } from "next/navigation";
import MovieListPage from "@/components/MovieListPage";
import { getMovieGenres, getMoviesByGenre } from "@/lib/tmdb";
import { MAX_MOVIE_PAGES, parseMoviePage } from "@/lib/pagination";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

export default async function GenrePage({ params, searchParams }: Props) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) notFound();

  const genres = await getMovieGenres();
  const genre = genres.find((item) => item.id.toString() === id);
  if (!genre) notFound();

  const query = await searchParams;
  const page = parseMoviePage(query.page);
  const data = await getMoviesByGenre(genre.id, page);
  const lastPage = Math.max(1, Math.min(data.total_pages, MAX_MOVIE_PAGES));
  const basePath = `/genre/${genre.id}`;

  if (page > lastPage) {
    redirect(lastPage === 1 ? basePath : `${basePath}?page=${lastPage}`);
  }

  return <MovieListPage title={`${genre.name} Movies`} data={data} basePath={basePath} />;
}
