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
    getMovieDetails(id, "videos,credits,recommendations,release_dates"),
    getSimilarMovies(id),
  ]).catch((error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 404) notFound();
    throw error;
  });
  const trailerKey = selectTrailerKey(movie.videos?.results ?? []);

  const similarMovies = similarData.results
    .filter((movie: { poster_path: string | null }) => movie.poster_path)
    .slice(0, 5);
  
  const releaseDate = movie.release_date?.replaceAll("-", ".") || "N/A";
  const certification = movie.release_dates?.results
    ?.find((region: { iso_3166_1: string }) => region.iso_3166_1 === "US")?.release_dates
    ?.find((release: { certification: string }) => release.certification)?.certification || (movie.adult ? "18+" : "NR");
  const voteCount = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(movie.vote_count);

  const hours = Math.floor((movie.runtime || 0) / 60);
  const minutes = (movie.runtime || 0) % 60;

  return (
    <main className="mx-auto w-full max-w-[1100px] flex-1 px-5 py-8 sm:px-6 sm:py-12">
      {/* Movie title and rating */}
      <div className="mb-4 flex items-end justify-between gap-3 sm:mb-6 sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {movie.title}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {releaseDate} · {certification} ·{" "}
            {hours}h {minutes}m
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="hidden text-xs text-muted-foreground sm:block">Rating</p>
          <p className="text-lg font-semibold">
            <span className="text-yellow-400">★</span>{" "}
            {movie.vote_average.toFixed(1)}/10
          </p>
          <p className="text-xs text-muted-foreground">
            {voteCount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-x-8 gap-y-8 sm:grid-cols-[1fr_2.6fr] sm:gap-6">
        <div className="col-start-1 row-start-2 aspect-[2/3] self-start overflow-hidden bg-muted sm:row-start-1 sm:rounded-lg">
          {movie.poster_path && <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="h-full w-full object-cover" />}
        </div>
        <div className="relative col-span-2 col-start-1 row-start-1 -mx-5 aspect-video overflow-hidden bg-muted sm:col-span-1 sm:col-start-2 sm:mx-0 sm:aspect-auto sm:rounded-lg">
          {movie.backdrop_path && <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={`${movie.title} backdrop`} className="h-full w-full object-cover" />}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
          <div className="absolute bottom-3 left-3 z-10 sm:bottom-6 sm:left-6"><TrailerModal trailerKey={trailerKey} title={movie.title} /></div>
        </div>
        <div className="col-start-2 row-start-2 sm:col-span-2 sm:col-start-1">
          <div className="flex flex-wrap gap-2">{movie.genres.map((genre: Genre) => <Link key={genre.id} href={`/genre/${genre.id}`} className="rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold hover:bg-muted">{genre.name}</Link>)}</div>
          <p className="mt-5 text-sm leading-6 text-foreground">{movie.overview}</p>
        </div>
      </div>

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
      <section className="mt-10 sm:mt-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            More like this
          </h2>

          <Link
            href={`/movie/${id}/similar`}
            className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            See more →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
          {similarMovies.map((similar: {
            id: number;
            title: string;
            poster_path: string | null;
            vote_average: number;
          }, index: number) => (
            <div key={similar.id} className={index >= 2 ? "hidden sm:block" : ""}><MovieCard
              movie={similar}
            /></div>
          ))}
        </div>
      </section>
    </main>
  );
}
