export default function Loading() {
  return (
    <main aria-busy="true" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-10 sm:px-6 sm:py-12">
      <p role="status" className="sr-only">Loading movies…</p>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="mb-8 h-8 w-48 rounded bg-muted" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5 lg:gap-8">
          {Array.from({ length: 10 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-lg bg-muted">
              <div className="aspect-[2/3] bg-muted-foreground/10" />
              <div className="m-3 h-4 rounded bg-muted-foreground/10" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
