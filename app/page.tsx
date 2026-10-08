
import HeroBanner from "@/components/HeroBanner";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";

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
    <section className="mb-[52px]">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {title}
        </h2>

        <a
          href={href}
          className="flex items-center gap-2 text-sm"
        >
          See more <span>→</span>
        </a>
      </div>

      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
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
      <Navbar />

      <HeroBanner movies={nowPlaying.results.slice(0, 5)} />

      <main className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-[1440px] px-6 py-12">

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

      <Footer />

    </>
  );
}


