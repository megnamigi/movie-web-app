import Link from "next/link";

type MovieCardProps = {
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
  };
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="block overflow-hidden rounded-lg bg-[#F4F4F5] transition-transform duration-200 hover:scale-[1.02]"
    >
      {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="aspect-[2/3] w-full object-cover"
        />
      ) : (
        <div className="aspect-[2/3] bg-gray-200" />
      )}

      <div className="min-h-[64px] p-2">
        <div className="flex items-center gap-1 text-xs">
          <span className="text-yellow-400">★</span>
          <span className="text-gray-700">
            {movie.vote_average.toFixed(1)}
          </span>
          <span className="text-gray-400">/10</span>
        </div>

        <h3 className="mt-1 text-sm leading-5 text-black">
          {movie.title}
        </h3>
      </div>
    </Link>
  );
}
