"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Star } from "lucide-react";
import TrailerModal from "@/components/TrailerModal";
import "@/components/HeroBanner.css";

type Movie = {
  id: number;
  title: string;
  overview: string;
  vote_average: number;
  backdrop_path: string | null;
};

type Slide = { current: number; previous: number | null; direction: number; version: number };
const AUTOPLAY_MS = 5000;
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
function getReducedMotion() { return window.matchMedia(reducedMotionQuery).matches; }
function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}
function getVisibility() { return !document.hidden; }

function MovieCopy({ movie, heading = false }: { movie: Movie; heading?: boolean }) {
  const Title = heading ? "h1" : "div";
  return <>
        <div className="flex items-center justify-between gap-4 sm:block">
          <div className="min-w-0"><p className="text-sm leading-5">Now Playing:</p><Title className="text-2xl font-semibold leading-8 sm:text-4xl sm:font-bold">{movie.title}</Title></div>
          <div className="flex shrink-0 items-center gap-1 sm:mt-2 sm:gap-2"><Star size={24} fill="#facc15" color="#facc15" /><span className="text-base font-semibold">{movie.vote_average.toFixed(1)}<span className="font-normal text-muted-foreground sm:text-white/70">/10</span></span></div>
        </div>
        <p className="mt-4 text-sm leading-5 sm:mt-6 sm:line-clamp-4 sm:leading-relaxed">{movie.overview}</p>
  </>;
}

export default function HeroBanner({ movies }: { movies: Movie[] }) {
  const [slide, setSlide] = useState<Slide>({ current: 0, previous: null, direction: 1, version: 0 });
  const [userPaused, setUserPaused] = useState(false);
  const [rotationRequested, setRotationRequested] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [inView, setInView] = useState(false);
  const banner = useRef<HTMLElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => true);
  const pageVisible = useSyncExternalStore(subscribeVisibility, getVisibility, () => true);
  const count = movies.length;
  const currentIndex = slide.current;
  const multiple = count > 1;
  const autoRunning = multiple && !userPaused && (rotationRequested || (!hovered && !focused)) && !trailerOpen && inView && pageVisible && !reducedMotion;

  useEffect(() => {
    const element = banner.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.2), { threshold: 0.2 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [count]);

  useEffect(() => {
    if (!autoRunning) return;
    const timer = window.setTimeout(() => {
      setSlide((previous) => ({ current: (previous.current + 1) % count, previous: previous.current % count, direction: 1, version: previous.version + 1 }));
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [autoRunning, count, slide.version]);

  useEffect(() => {
    if (slide.previous === null) return;
    const timer = window.setTimeout(() => {
      setSlide((previous) => previous.version === slide.version ? { ...previous, previous: null } : previous);
    }, 750);
    return () => window.clearTimeout(timer);
  }, [slide.previous, slide.version]);

  // Warm the next image before the automatic transition starts.
  useEffect(() => {
    if (!multiple) return;
    const path = movies[(currentIndex + 1) % count].backdrop_path;
    if (!path) return;
    const image = new Image();
    image.src = `https://image.tmdb.org/t/p/original${path}`;
  }, [movies, count, multiple, currentIndex]);

  if (!count) return null;
  const current = slide.current % count;
  const movie = movies[current];
  const previousMovie = slide.previous === null ? null : movies[slide.previous % count];
  const moving = previousMovie !== null && !reducedMotion;
  const changeMovie = (direction: number) => {
    if (!multiple || moving) return;
    setRotationRequested(false);
    setSlide((previous) => ({ current: (previous.current + direction + count) % count, previous: reducedMotion ? null : previous.current % count, direction, version: previous.version + 1 }));
  };
  const selectMovie = (index: number) => {
    if (index === current || moving) return;
    setRotationRequested(false);
    setSlide((previous) => ({ current: index, previous: reducedMotion ? null : previous.current % count, direction: index > current ? 1 : -1, version: previous.version + 1 }));
  };
  const imageStyle = (item: Movie) => ({ backgroundImage: item.backdrop_path ? `url(https://image.tmdb.org/t/p/original${item.backdrop_path})` : undefined });

  return <section ref={banner} aria-label="Now playing movies" aria-roledescription="carousel" tabIndex={0}
    onPointerEnter={(event) => { if (event.pointerType === "mouse") { setHovered(true); setRotationRequested(false); } }}
    onPointerLeave={(event) => { if (event.pointerType === "mouse") { setHovered(false); setRotationRequested(false); } }}
    onFocusCapture={(event) => {
      if (event.target instanceof Element && event.target.closest("[data-carousel-rotation]")) { setFocused(false); return; }
      setFocused(true);
      setRotationRequested(false);
    }}
    onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    onKeyDown={(event) => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); changeMovie(event.key === "ArrowRight" ? 1 : -1); }
    }} className="relative w-full bg-background text-foreground sm:h-[600px] sm:text-white">
    <div role="img" aria-label={`${movie.title} backdrop`}
      onTouchStart={(event) => { const touch = event.changedTouches[0]; touchStart.current = { x: touch.clientX, y: touch.clientY }; }}
      onTouchEnd={(event) => {
        if (!touchStart.current) return;
        const touch = event.changedTouches[0];
        const dx = touch.clientX - touchStart.current.x;
        const dy = touch.clientY - touchStart.current.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) changeMovie(dx < 0 ? 1 : -1);
        touchStart.current = null;
      }} onTouchCancel={() => { touchStart.current = null; }}
      className="relative h-[246px] overflow-hidden bg-muted sm:absolute sm:inset-0 sm:h-full">
      {moving && previousMovie && <div aria-hidden="true" key={`previous-${slide.version}`} className={`movie-hero-slide ${slide.direction > 0 ? "movie-hero-leave-forward" : "movie-hero-leave-backward"}`} style={imageStyle(previousMovie)} />}
      <div aria-hidden="true" key={slide.version} style={imageStyle(movie)}
        className={`movie-hero-slide ${moving ? slide.direction > 0 ? "movie-hero-enter-forward" : "movie-hero-enter-backward" : ""}`}
        onAnimationEnd={() => setSlide((previous) => previous.version === slide.version ? { ...previous, previous: null } : previous)} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-black/65 to-transparent sm:block" />
    </div>
    <div className="px-5 pt-6 sm:absolute sm:left-[10%] sm:top-1/2 sm:w-[320px] sm:max-w-[65%] sm:-translate-y-1/2 sm:p-0">
      <div className="grid sm:block">
        {multiple && movies.map((item) => <div key={item.id} aria-hidden="true" className="pointer-events-none invisible col-start-1 row-start-1 min-w-0 sm:hidden"><MovieCopy movie={item} /></div>)}
        <div key={slide.version} aria-live={autoRunning ? "off" : "polite"} className={`col-start-1 row-start-1 min-w-0 ${slide.version > 0 && !reducedMotion ? "movie-hero-details-enter" : ""}`}>
          <span className="sr-only">Movie {current + 1} of {count}</span>
          <MovieCopy movie={movie} heading />
        </div>
      </div>
      <TrailerModal key={movie.id} movieId={movie.id} title={movie.title} variant="hero" onOpenChange={setTrailerOpen} />
    </div>
    {multiple && <>
      <button type="button" onClick={() => changeMovie(-1)} disabled={moving} aria-label="Previous movie" className="absolute left-4 top-1/2 hidden rounded-full bg-white/90 p-3 text-black sm:block"><ChevronLeft size={20} /></button>
      <button type="button" onClick={() => changeMovie(1)} disabled={moving} aria-label="Next movie" className="absolute right-6 top-1/2 hidden rounded-full bg-white/90 p-3 text-black sm:block"><ChevronRight size={20} /></button>
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 gap-2 sm:flex">{movies.map((item, index) => <button key={item.id} type="button" disabled={moving} aria-label={`Show movie ${index + 1}`} aria-pressed={current === index} onClick={() => selectMovie(index)} className={`h-2 w-2 rounded-full ${current === index ? "bg-white" : "bg-white/40"}`} />)}</div>
      <button type="button" data-carousel-rotation onClick={() => { setUserPaused(!userPaused); setRotationRequested(userPaused); }} aria-label={userPaused ? "Resume slideshow" : "Pause slideshow"} aria-pressed={userPaused}
        className="absolute right-5 top-[202px] flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:bottom-5 sm:right-6 sm:top-auto motion-reduce:hidden">
        {userPaused ? <Play size={16} /> : <Pause size={16} />}
      </button>
    </>}
  </section>;
}
