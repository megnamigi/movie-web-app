"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useSWR from "swr";
import { Play, X } from "lucide-react";

type Props = {
  trailerKey?: string | null;
  movieId?: number;
  title: string;
  variant?: "overlay" | "hero";
  onOpenChange?: (open: boolean) => void;
};

async function fetchTrailer(url: string): Promise<{ trailerKey: string | null }> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load trailer.");
  return response.json();
}

export default function TrailerModal({ trailerKey, movieId, title, variant = "overlay", onOpenChange }: Props) {
  const [open, setOpen] = useState(false);
  const changeOpen = (value: boolean) => { setOpen(value); onOpenChange?.(value); };
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const shouldFetch = open && !trailerKey && movieId !== undefined;
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/movies/${movieId}/trailer` : null,
    fetchTrailer,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
  const activeKey = trailerKey ?? data?.trailerKey ?? null;
  const loading = shouldFetch && (isLoading || (!data && !error));
  const available = Boolean(trailerKey || movieId !== undefined);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-label={available ? `Watch trailer for ${title}` : `Trailer unavailable for ${title}`}
        onClick={() => changeOpen(true)}
        disabled={!available}
        className={variant === "hero"
          ? "mt-4 flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm text-background disabled:opacity-50 sm:mt-5 sm:bg-white sm:px-5 sm:py-3 sm:text-black"
          : "flex items-center gap-2 text-white disabled:opacity-50 sm:gap-3"}
      >
        {variant === "hero" ? <Play size={16} /> : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black">
            <Play size={18} fill="black" />
          </span>
        )}
        <span className={variant === "hero" ? "" : "text-sm"}>
          {available ? (variant === "hero" ? "Watch Trailer" : "Play trailer") : "Trailer unavailable"}
        </span>
      </button>

      {open && createPortal(
        <dialog
          ref={dialogRef}
          aria-labelledby={titleId}
          onCancel={() => changeOpen(false)}
          onClose={() => changeOpen(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) changeOpen(false);
          }}
          className="fixed inset-0 m-0 h-dvh max-h-dvh w-screen max-w-none overflow-auto border-0 bg-black p-0 text-white backdrop:bg-black/80 sm:m-auto sm:h-auto sm:max-h-[90dvh] sm:w-[92vw] sm:max-w-4xl sm:rounded-lg"
        >
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-end gap-4 p-4 sm:static sm:justify-between">
            <h2 id={titleId} className="sr-only font-semibold sm:not-sr-only">{title} — Trailer</h2>
            <button type="button" onClick={() => changeOpen(false)} aria-label="Close trailer" className="shrink-0 rounded p-1 hover:bg-white/15">
              <X size={24} />
            </button>
          </div>
          <div className="flex min-h-dvh flex-col justify-center sm:min-h-0">
          {loading ? (
            <div role="status" className="flex aspect-video items-center justify-center p-6 text-center text-gray-300">Loading trailer…</div>
          ) : error ? (
            <div role="alert" className="flex aspect-video flex-col items-center justify-center gap-4 p-6 text-center">
              <p>Could not load the trailer.</p>
              <button type="button" onClick={() => void mutate()} className="rounded bg-white px-4 py-2 text-black">Try again</button>
            </div>
          ) : activeKey ? (
            <>
            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube.com/embed/${encodeURIComponent(activeKey)}?autoplay=1&rel=0`}
              title={`${title} trailer`}
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            <div className="px-4 py-3 text-right text-sm">
              <a href={`https://www.youtube.com/watch?v=${encodeURIComponent(activeKey)}`} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white hover:underline">Open on YouTube ↗</a>
            </div>
            </>
          ) : (
            <div role="status" className="flex aspect-video items-center justify-center p-6 text-center text-gray-300">No trailer is available for this movie.</div>
          )}
          </div>
        </dialog>,
        document.body
      )}
    </>
  );
}
