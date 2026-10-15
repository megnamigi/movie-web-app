import { notFound, redirect } from "next/navigation";
import MovieListPage from "@/components/MovieListPage";
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies } from "@/lib/tmdb";
import { MAX_MOVIE_PAGES, parseMoviePage } from "@/lib/pagination";

const categories = [
  { slug: "upcoming", title: "Upcoming", getMovies: getUpcomingMovies },
  { slug: "popular", title: "Popular", getMovies: getPopularMovies },
  { slug: "top-rated", title: "Top Rated", getMovies: getTopRatedMovies },
];

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const config = categories.find((item) => item.slug === category);
  if (!config) notFound();

  const query = await searchParams;
  const page = parseMoviePage(query.page);
  const data = await config.getMovies(page);
  const lastPage = Math.max(1, Math.min(data.total_pages, MAX_MOVIE_PAGES));
  const basePath = `/${config.slug}`;

  if (page > lastPage) {
    redirect(lastPage === 1 ? basePath : `${basePath}?page=${lastPage}`);
  }

  return <MovieListPage title={config.title} data={data} basePath={basePath} />;
}
