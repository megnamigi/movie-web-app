import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-20 text-center">
      <p className="text-sm text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
      <p className="mt-3 text-muted-foreground">The movie or page you requested could not be found.</p>
      <Link href="/" className="mt-6 inline-block rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Back to home</Link>
    </main>
  );
}
