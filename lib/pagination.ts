// TMDB exposes at most 500 pages for these movie lists.
export const MAX_MOVIE_PAGES = 500;

export function parseMoviePage(value: string | string[] | undefined, maxPages = MAX_MOVIE_PAGES): number {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return 1;
  return Math.min(Number(value), maxPages);
}
