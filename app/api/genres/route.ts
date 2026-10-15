import { getMovieGenres } from "@/lib/tmdb";

export async function GET() {
  try {
    const genres = await getMovieGenres();
    return Response.json(genres, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  } catch {
    return Response.json({ error: "Movie genres are unavailable." }, { status: 502 });
  }
}
