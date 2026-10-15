"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold">Unable to load movies</h1>
      <p className="mt-3 text-muted-foreground">Please check your connection and try again.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Try again</button>
        <Link href="/" className="rounded-md border px-4 py-2 hover:bg-muted">Back to home</Link>
      </div>
    </main>
  );
}
