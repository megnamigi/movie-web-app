"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";

type Props = {
  trailerKey: string | null;
  title: string;
};

export default function TrailerModal({
  trailerKey,
  title,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!trailerKey}
        className="flex items-center gap-3 text-white disabled:opacity-50"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
          <Play size={18} fill="black" />
        </span>
        <span className="text-sm">
          {trailerKey ? "Play trailer" : "Trailer unavailable"}
        </span>
      </button>

      {open && trailerKey && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-black">
            <div className="flex items-center justify-between p-4 text-white">
              <h2 className="font-semibold">
                {title} - Trailer
              </h2>

              <button
                onClick={() => setOpen(false)}
                aria-label="Close trailer"
              >
                <X size={24} />
              </button>
            </div>

            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title={`${title} trailer`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
