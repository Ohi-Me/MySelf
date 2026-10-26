"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-4 max-w-2xl text-[2.2rem] leading-tight font-medium tracking-tight text-ink">This page failed to render.</h1>
      <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-ink-2">It is not you. Try again, or go back to the home page.</p>
      <div className="mt-8 flex gap-3">
        <button type="button" onClick={() => retry()} className="rounded-full bg-ink px-5 py-2.5 text-[0.92rem] text-paper">
          Try again
        </button>
        <Link href="/" className="rounded-full border border-ink px-5 py-2.5 text-[0.92rem] text-ink">
          Home
        </Link>
      </div>
    </div>
  );
}
