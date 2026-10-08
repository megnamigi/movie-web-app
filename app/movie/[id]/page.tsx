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
  const movie = await getMovieDetails(id);
  type Video = {
  site: string;
  type: string;
  official: boolean;
  key: string;
};

const videos: Video[] = movie.videos?.results ?? [];

const trailer =
  videos.find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer" &&
      video.official
  ) ??
  videos.find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Trailer"
  ) ??
  videos.find(
    (video) =>
      video.site === "YouTube" &&
      video.type === "Teaser"
  );

  const trailerKey = trailer?.key ?? null;
  const similarData = await getSimilarMovies(id);

  const similarMovies = similarData.results
    .filter((movie: { poster_path: string | null }) => movie.poster_path)
    .slice(0, 5);
  
  const releaseDate = movie.release_date || "N/A";

  const hours = Math.floor((movie.runtime || 0) / 60);
  const minutes = (movie.runtime || 0) % 60;

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12">
      {/* Movie title and rating */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">
            {movie.title}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {releaseDate} · {movie.adult ? "18+" : "NR"} ·{" "}
            {hours}h {minutes}m
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500">Rating</p>
          <p className="text-lg font-semibold">
            <span className="text-yellow-400">★</span>{" "}
            {movie.vote_average.toFixed(1)}/10
          </p>
          <p className="text-xs text-gray-400">
            {movie.vote_count} votes
          </p>
        </div>
      </div>

      {/* Poster and backdrop */}
      <div className="grid grid-cols-[1fr_2.6fr] gap-6">
        <div className="overflow-hidden rounded-lg">
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="relative overflow-hidden rounded-lg">
          {movie.backdrop_path && (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={`${movie.title} backdrop`}
              className="h-full w-full object-cover"
            />
          )}

          <div className="absolute bottom-6 left-6 z-10">
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
          <span
            key={genre.id}
            className="rounded-full border border-gray-200 px-3 py-1 text-xs"
          >
            {genre.name}
          </span>
        ))}
      </div>

      {/* Overview */}
      <p className="mt-5 text-sm leading-7 text-gray-700">
        {movie.overview}
      </p>

      {/* Credits */}
      <div className="mt-6 divide-y divide-gray-200 border-b border-gray-200">
        <div className="flex gap-8 py-4 text-sm">
          <span className="w-24 font-semibold">Director</span>
          <span className="text-gray-600">
            {movie.credits?.crew
              ?.filter(
                (person: { job: string }) =>
                  person.job === "Director"
              )
              .map((person: { name: string }) => person.name)
              .join(", ") || "N/A"}
          </span>
        </div>

        <div className="flex gap-8 py-4 text-sm">
          <span className="w-24 font-semibold">Writers</span>
          <span className="text-gray-600">
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

        <div className="flex gap-8 py-4 text-sm">
          <span className="w-24 font-semibold">Stars</span>
          <span className="text-gray-600">
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
            className="text-sm hover:text-indigo-600"
          >
            See more →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
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
