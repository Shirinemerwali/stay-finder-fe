
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-zinc-600">
        We couldn&apos;t load the page. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-lg bg-zinc-900 px-5 py-3 text-white hover:bg-zinc-700"
      >
        Try again
      </button>
    </main>
  );
}
