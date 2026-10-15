import { searchMovies } from "@/lib/tmdb";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!query) return Response.json({ results: [], total_results: 0 });
  try {
    const data = await searchMovies(query);
    return Response.json({ results: data.results.slice(0, 5), total_results: data.total_results });
  } catch {
    return Response.json({ error: "Search is unavailable." }, { status: 502 });
  }
}
