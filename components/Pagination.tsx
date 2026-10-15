import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MAX_MOVIE_PAGES } from "@/lib/pagination";

export default function Pagination({ currentPage, totalPages, basePath, maxPages = MAX_MOVIE_PAGES }: { currentPage: number; totalPages: number; basePath: string; maxPages?: number }) {
  const last = Math.max(1, Math.min(totalPages, maxPages));
  const pages = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, last])].filter((page) => page >= 1 && page <= last).sort((a, b) => a - b);
  const href = (page: number) => page === 1 ? basePath : `${basePath}${basePath.includes("?") ? "&" : "?"}page=${page}`;
  const linkClass = "inline-flex h-9 items-center justify-center gap-1 rounded-md px-2 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return <nav aria-label="Movie list pages" className="mt-8 flex flex-wrap items-center justify-end gap-1 sm:gap-2">
    {currentPage > 1 ? <Link aria-label="Previous page" href={href(currentPage - 1)} className={linkClass}><ChevronLeft size={16} /><span className="hidden sm:inline">Previous</span></Link> : <span aria-label="Previous page" aria-disabled="true" className={`${linkClass} pointer-events-none text-muted-foreground/50`}><ChevronLeft size={16} /><span className="hidden sm:inline">Previous</span></span>}
    {pages.map((page, index) => <span key={page} className="flex items-center gap-1">
      {index > 0 && page - pages[index - 1] > 1 && <span className="px-1 text-muted-foreground">…</span>}
      {page === currentPage ? <span aria-current="page" aria-label={`Page ${page}`} className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-border px-2 text-sm">{page}</span> : <Link href={href(page)} aria-label={`Page ${page}`} className={`${linkClass} min-w-9`}>{page}</Link>}
    </span>)}
    {currentPage < last ? <Link aria-label="Next page" href={href(currentPage + 1)} className={linkClass}><span className="hidden sm:inline">Next</span><ChevronRight size={16} /></Link> : <span aria-label="Next page" aria-disabled="true" className={`${linkClass} pointer-events-none text-muted-foreground/50`}><span className="hidden sm:inline">Next</span><ChevronRight size={16} /></span>}
  </nav>;
}
