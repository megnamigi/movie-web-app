import { isAxiosError } from "axios";
import { getMovieDetails } from "@/lib/tmdb";
import { selectTrailerKey } from "@/lib/trailers";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) {
    return Response.json({ error: "Invalid movie." }, { status: 400 });
  }

  try {
    const movie = await getMovieDetails(id, "videos");
    return Response.json({ trailerKey: selectTrailerKey(movie.videos?.results ?? []) });
  } catch (error) {
    const status = isAxiosError(error) && error.response?.status === 404 ? 404 : 502;
    return Response.json({ error: "Unable to load the trailer." }, { status });
  }
}
