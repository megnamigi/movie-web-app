import "server-only";
import axios from "axios";

export type MovieSummary = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
};

export type MovieListResponse = {
  page: number;
  results: MovieSummary[];
  total_pages: number;
  total_results: number;
};

export type MovieGenre = {
  id: number;
  name: string;
};

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 15000,
  headers: {
    Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
    accept: "application/json",
  },
});

export async function getMovieGenres() {
  const response = await tmdb.get<{ genres: MovieGenre[] }>("/genre/movie/list", {
    params: { language: "en-US" },
    timeout: 10000,
  });
  return response.data.genres;
}

export async function getMoviesByGenre(genreId: number, page = 1) {
  const response = await tmdb.get<MovieListResponse>("/discover/movie", {
    params: {
      language: "en-US",
      with_genres: genreId,
      sort_by: "popularity.desc",
      include_adult: false,
      include_video: false,
      page,
    },
  });
  return response.data;
}

export async function getPopularMovies(page = 1) {
  const response = await tmdb.get<MovieListResponse>("/movie/popular", {
    params: {
      language: "en-US",
      page,
    },
  });

  return response.data;
}


export async function getUpcomingMovies(page = 1) {
  const response = await tmdb.get<MovieListResponse>("/movie/upcoming", {
    params: { language: "en-US", page },
  });
  return response.data;
}

export async function getTopRatedMovies(page = 1) {
  const response = await tmdb.get<MovieListResponse>("/movie/top_rated", {
    params: { language: "en-US", page },
  });
  return response.data;
}

export async function getNowPlayingMovies() {
  const response = await tmdb.get("/movie/now_playing", {
    params: { language: "en-US", page: 1 },
  });
  return response.data;
}

export async function searchMovies(query: string, page = 1) {
  const response = await tmdb.get<MovieListResponse>("/search/movie", {
    params: {
      query,
      language: "en-US",
      page,
      include_adult: false,
    },
  });

  return response.data;
}

export async function getMovieDetails(
  id: string,
  appendToResponse = "videos,credits,recommendations"
) {
  const response = await tmdb.get(`/movie/${id}`, {
    params: {
      language: "en-US",
      append_to_response: appendToResponse,
    },
  });

  return response.data;
}

export async function getSimilarMovies(id: string, page = 1) {
  const response = await tmdb.get<MovieListResponse>(`/movie/${id}/similar`, {
    params: {
      language: "en-US",
      page,
    },
  });

  return response.data;
}
