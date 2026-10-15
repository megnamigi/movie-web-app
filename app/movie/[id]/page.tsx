import { isAxiosError } from "axios";
import { notFound } from "next/navigation";
import { selectTrailerKey } from "@/lib/trailers";
import TrailerModal from "@/components/TrailerModal";
import { getMovieDetails, getSimilarMovies } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

type Genre = {
  id: number;
  name: string;
};

export default async function MovieDetailsPage({
  params,
}: Props) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) notFound();
  const [movie, similarData] = await Promise.all([
    getMovieDetails(id),
    getSimilarMovies(id),
  ]).catch((error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 404) notFound();
    throw error;
  });
  const trailerKey = selectTrailerKey(movie.videos?.results ?? []);

  const similarMovies = similarData.results
    .filter((movie: { poster_path: string | null }) => movie.poster_path)
    .slice(0, 5);
  
  const releaseDate = movie.release_date || "N/A";

  const hours = Math.floor((movie.runtime || 0) / 60);
  const minutes = (movie.runtime || 0) % 60;

  return (
    <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-10 sm:px-6 sm:py-12">
      {/* Movie title and rating */}
      <div className="mb-6 flex items-start justify-between gap-4 sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {movie.title}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {releaseDate} · {movie.adult ? "18+" : "NR"} ·{" "}
            {hours}h {minutes}m
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-xs text-muted-foreground">Rating</p>
          <p className="text-lg font-semibold">
            <span className="text-yellow-400">★</span>{" "}
            {movie.vote_average.toFixed(1)}/10
          </p>
          <p className="text-xs text-muted-foreground">
            {movie.vote_count} votes
          </p>
        </div>
      </div>

      {/* Poster and backdrop */}
      <div className="grid grid-cols-[1fr_2fr] gap-3 sm:grid-cols-[1fr_2.6fr] sm:gap-6">
        <div className="aspect-[2/3] overflow-hidden rounded-lg bg-muted">
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="relative overflow-hidden rounded-lg bg-muted">
          {movie.backdrop_path && (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={`${movie.title} backdrop`}
              className="h-full w-full object-cover"
            />
          )}

          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
          <div className="absolute bottom-3 left-3 z-10 sm:bottom-6 sm:left-6">
            <TrailerModal
                trailerKey={trailerKey}
                title={movie.title}
            />
        </div>

        </div>
      </div>

      {/* Genres */}
      <div className="mt-6 flex flex-wrap gap-2">
        {movie.genres.map((genre: Genre) => (
          <Link
            key={genre.id}
            href={`/genre/${genre.id}`}
            className="rounded-full border border-border px-3 py-1 text-xs hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {genre.name}
          </Link>
        ))}
      </div>

      {/* Overview */}
      <p className="mt-5 text-sm leading-7 text-muted-foreground">
        {movie.overview}
      </p>

      {/* Credits */}
      <div className="mt-6 divide-y divide-border border-b border-border">
        <div className="flex gap-4 py-4 text-sm sm:gap-8">
          <span className="w-20 shrink-0 font-semibold sm:w-24">Director</span>
          <span className="text-muted-foreground">
            {movie.credits?.crew
              ?.filter(
                (person: { job: string }) =>
                  person.job === "Director"
              )
              .map((person: { name: string }) => person.name)
              .join(", ") || "N/A"}
          </span>
        </div>

        <div className="flex gap-4 py-4 text-sm sm:gap-8">
          <span className="w-20 shrink-0 font-semibold sm:w-24">Writers</span>
          <span className="text-muted-foreground">
            {movie.credits?.crew
              ?.filter(
                (person: { job: string }) =>
                  ["Writer", "Screenplay", "Story"].includes(
                    person.job
                  )
              )
              .map((person: { name: string }) => person.name)
              .filter(
                (name: string, index: number, arr: string[]) =>
                  arr.indexOf(name) === index
              )
              .join(" · ") || "N/A"}
          </span>
        </div>

        <div className="flex gap-4 py-4 text-sm sm:gap-8">
          <span className="w-20 shrink-0 font-semibold sm:w-24">Stars</span>
          <span className="text-muted-foreground">
            {movie.credits?.cast
              ?.slice(0, 3)
              .map((person: { name: string }) => person.name)
              .join(" · ") || "N/A"}
          </span>
        </div>
      </div>

            {/* More like this */}
      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            More like this
          </h2>

          <Link
            href={`/movie/${id}/similar`}
            className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            See more →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
          {similarMovies.map((similar: {
            id: number;
            title: string;
            poster_path: string | null;
            vote_average: number;
          }) => (
            <MovieCard
              key={similar.id}
              movie={similar}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
