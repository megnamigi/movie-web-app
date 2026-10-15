export type MovieVideo = {
  site: string;
  type: string;
  official?: boolean;
  key: string;
};

export function selectTrailerKey(videos: MovieVideo[]): string | null {
  const youtube = videos.filter((video) =>
    video.site === "YouTube" && /^[A-Za-z0-9_-]{11}$/.test(video.key)
  );
  const trailer = youtube.find((video) => video.type === "Trailer" && video.official)
    ?? youtube.find((video) => video.type === "Trailer")
    ?? youtube.find((video) => video.type === "Teaser");
  return trailer?.key ?? null;
}
