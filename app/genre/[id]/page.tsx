import { notFound, redirect } from "next/navigation";
import { getMovieGenres } from "@/lib/tmdb";
import { parseMoviePage } from "@/lib/pagination";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ page?: string | string[] }> };
export default async function GenrePage({ params, searchParams }: Props) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) notFound();
  const genres = await getMovieGenres();
  if (!genres.some((genre) => String(genre.id) === id)) notFound();
  const page = parseMoviePage((await searchParams).page);
  redirect(`/genres?ids=${id}${page > 1 ? `&page=${page}` : ""}`);
}
