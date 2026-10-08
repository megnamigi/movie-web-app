
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";

type Movie = {
  id: number;
  title: string;
  overview: string;
  vote_average: number;
  backdrop_path: string | null;
};

export default function HeroBanner({
  movies,
}: {
  movies: Movie[];
}) {
  const [current, setCurrent] = useState(0);

  if (!movies.length) return null;

  const movie = movies[current];

  const nextMovie = () => {
    setCurrent((prev) => (prev + 1) % movies.length);
  };

  const prevMovie = () => {
    setCurrent((prev) =>
      (prev - 1 + movies.length) % movies.length
    );
  };

  return (
    <section
      className="relative w-full h-[600px] bg-cover bg-center text-white"
      style={{
        backgroundImage: movie.backdrop_path
          ? `linear-gradient(90deg, rgba(0,0,0,0.65), transparent 75%), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : undefined,
      }}
    >
      <div className="absolute left-[10%] top-1/2 w-[320px] max-w-[65%] -translate-y-1/2">
        <p className="text-sm">Now Playing:</p>

        <h1 className="text-4xl font-bold">
          {movie.title}
        </h1>

        <div className="mt-2 flex items-center gap-2">
          <Star
            size={22}
            fill="#facc15"
            color="#facc15"
          />
          <span>
            {movie.vote_average.toFixed(1)}/10
          </span>
        </div>

        <p className="mt-6 line-clamp-4 text-sm leading-relaxed">
          {movie.overview}
        </p>

        <button
          type="button"
          className="mt-5 flex items-center gap-2 rounded bg-white px-5 py-3 text-sm text-black"
        >
          <Play size={16} />
          Watch Trailer
        </button>
      </div>

      <button
        type="button"
        onClick={prevMovie}
        aria-label="Previous movie"
        className="absolute left-4 top-1/2 rounded-full bg-white/90 p-3 text-black"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        type="button"
        onClick={nextMovie}
        aria-label="Next movie"
        className="absolute right-6 top-1/2 rounded-full bg-white/90 p-3 text-black"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {movies.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show movie ${index + 1}`}
            onClick={() => setCurrent(index)}
            className={`h-2 w-2 rounded-full ${
              current === index
                ? "bg-white"
                : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
