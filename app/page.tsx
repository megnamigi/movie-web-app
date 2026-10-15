
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import MovieCard from "@/components/MovieCard";

import {
  getPopularMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
} from "@/lib/tmdb";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
};

function MovieSection({
  title,
  movies,
  href,
}: {
  title: string;
  movies: Movie[];
  href: string;
}) {
  return (
    <section className="mb-12 last:mb-0 sm:mb-[52px]">
      <div className="mb-9 flex items-center sm:mb-8 justify-between">
        <h2 className="text-2xl font-semibold">
          {title}
        </h2>

        <Link
          href={href}
          className="flex items-center gap-2 text-sm"
        >
          See more <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5 lg:gap-8">
        {movies.slice(0, 10).map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default async function Home() {
  const [popular, upcoming, topRated, nowPlaying] =
    await Promise.all([
      getPopularMovies(),
      getUpcomingMovies(),
      getTopRatedMovies(),
      getNowPlayingMovies(),
    ]);

  return (
    <>

      <HeroBanner movies={nowPlaying.results.slice(0, 5)} />

      <main className="w-full flex-1 bg-background text-foreground">
        <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-12 sm:px-6 sm:py-12">

          <MovieSection
            title="Upcoming"
            movies={upcoming.results}
            href="/upcoming"
          />

          <MovieSection
            title="Popular"
            movies={popular.results}
            href="/popular"
          />

          <MovieSection
            title="Top Rated"
            movies={topRated.results}
            href="/top-rated"
          />

        </div>
      </main>


    </>
  );
}