import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { searchMovies } from "@/lib/tmdb";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const data = query
    ? await searchMovies(query)
    : { results: [] };

  const movies: Movie[] = data.results;

  return (
    <>
      <Navbar />

      <main className="mx-auto min-h-screen max-w-7xl px-6 py-12">
        <h1 className="mb-8 text-2xl font-bold">
          {query
            ? `Search results for "${query}"`
            : "Search Movies"}
        </h1>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            {query
              ? "No movies found."
              : "Enter a movie name to search."}
          </p>
        )}

    {/* More like this */}

        <section className="mt-12">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-black">
                    More like this
                </h2>

                <Link
                    href={`/movie/${id}/similar`}
                    className="flex items-center gap-2 text-sm text-black hover:text-indigo-600"
                >
                    See more
                    <span>→</span>
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                {similarMovies.map(
                    (similar: {
                        id: number;
                        title: string;
                        poster_path: string | null;
                        vote_average: number;
                    }) => (
                        <MovieCard key={similar.id} movie={similar} />
                    )
                )}
            </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
