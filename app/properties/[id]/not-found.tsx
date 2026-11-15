import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-bold">Stay not found</h1>
      <p className="text-zinc-600">
        Sorry, we couldn&apos;t find the accommodation you are looking for.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-zinc-900 px-5 py-3 text-white hover:bg-zinc-700"
      >
        Back to all stays
      </Link>
    </main>
  );
}