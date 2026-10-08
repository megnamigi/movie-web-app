import "server-only";
import axios from "axios";

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
    accept: "application/json",
  },
});

export async function getPopularMovies() {
  const response = await tmdb.get("/movie/popular", {
    params: {
      language: "en-US",
      page: 1,
    },
  });

  return response.data;
}


export async function getUpcomingMovies() {
  const response = await tmdb.get("/movie/upcoming", {
    params: { language: "en-US", page: 1 },
  });
  return response.data;
}

export async function getTopRatedMovies() {
  const response = await tmdb.get("/movie/top_rated", {
    params: { language: "en-US", page: 1 },
  });
  return response.data;
}

export async function getNowPlayingMovies() {
  const response = await tmdb.get("/movie/now_playing", {
    params: { language: "en-US", page: 1 },
  });
  return response.data;
}

export async function searchMovies(query: string) {
  const response = await tmdb.get("/search/movie", {
    params: {
      query,
      language: "en-US",
      page: 1,
      include_adult: false,
    },
  });

  return response.data;
}

export async function getMovieDetails(id: string) {
  const response = await tmdb.get(`/movie/${id}`, {
    params: {
      language: "en-US",
      append_to_response: "videos,credits,recommendations",
    },
  });

  return response.data;
}

export async function getSimilarMovies(id: string) {
  const response = await tmdb.get(`/movie/${id}/similar`, {
    params: {
      language: "en-US",
      page: 1,
    },
  });

  return response.data;
}
