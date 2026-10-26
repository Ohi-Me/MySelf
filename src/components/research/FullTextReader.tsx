"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { FullText } from "@/content/types";

type Status = "idle" | "loading" | "ready" | "error";

const ZOOMS = [0.75, 1, 1.25, 1.5, 2] as const;

/**
 * The full manuscript, read page by page on the site. PDF.js is loaded only
 * when the reader scrolls into view, every page is drawn when it comes near
 * the viewport, and the original PDF stays one click away (and is the
 * fallback when the reader cannot load).
 */
export function FullTextReader({ text, title }: { text: FullText; title: string }) {
  const host = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState<(typeof ZOOMS)[number]>(1);
  const [width, setWidth] = useState(0);

  // Start loading once the reader is close to the viewport.
  useEffect(() => {
    const el = host.current;
    if (!el || status !== "idle") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          setStatus("loading");
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [status]);

  useEffect(() => {
    if (status !== "loading") return;
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
        const loaded = await pdfjs.getDocument({ url: text.pdf }).promise;
        if (cancelled) return void loaded.destroy();
        setDoc(loaded);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, text.pdf]);

  useEffect(() => () => void doc?.destroy(), [doc]);

  // Track the column width so pages are drawn sharp for the space they have.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, [status]);

  // Current page = the page nearest the top of the scroll area.
  useEffect(() => {
    const el = scroller.current;
    if (!el || !doc) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setPage(Number((e.target as HTMLElement).dataset.page));
      },
      { root: el, rootMargin: "0px 0px -70% 0px" },
    );
    el.querySelectorAll("[data-page]").forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, [doc, zoom, width]);

  const goTo = useCallback((n: number) => {
    const target = scroller.current?.querySelector<HTMLElement>(`[data-page="${n}"]`);
    if (target && scroller.current) scroller.current.scrollTo({ top: target.offsetTop - 12, behavior: "smooth" });
  }, []);

  // Keep the page being read in view when the zoom changes.
  const pageRef = useRef(page);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const target = scroller.current?.querySelector<HTMLElement>(`[data-page="${pageRef.current}"]`);
      if (target && scroller.current) scroller.current.scrollTop = target.offsetTop - 12;
    });
    return () => cancelAnimationFrame(id);
  }, [zoom]);

  const pages = doc?.numPages ?? 0;
  const zi = ZOOMS.indexOf(zoom);

  return (
    <div ref={host} className="pdf-reader" aria-label={`Full text: ${title}`}>
      <div className="pdf-bar">
        <div className="flex min-w-0 items-center gap-2">
          <span className="hidden rounded-full border border-ink px-2 py-0.5 font-mono text-[0.64rem] tracking-wide whitespace-nowrap text-ink uppercase sm:inline-block">{text.version}</span>
          <span className="hidden truncate font-mono text-[0.7rem] text-ink-3 md:inline">{text.date}</span>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button type="button" className="pdf-btn" onClick={() => goTo(Math.max(1, page - 1))} disabled={!pages || page <= 1} aria-label="Previous page">
            ‹
          </button>
          <span className="min-w-[3.6rem] text-center font-mono text-[0.72rem] text-ink-2" aria-live="polite">
            {pages ? `${page} / ${pages}` : "– / –"}
          </span>
          <button type="button" className="pdf-btn" onClick={() => goTo(Math.min(pages, page + 1))} disabled={!pages || page >= pages} aria-label="Next page">
            ›
          </button>
          <span aria-hidden className="mx-1 hidden h-4 w-px bg-line-strong sm:block" />
          <button type="button" className="pdf-btn" onClick={() => setZoom(ZOOMS[Math.max(0, zi - 1)])} disabled={zi <= 0} aria-label="Zoom out">
            −
          </button>
          <span className="hidden w-10 text-center font-mono text-[0.72rem] text-ink-2 sm:inline">{Math.round(zoom * 100)}%</span>
          <button type="button" className="pdf-btn" onClick={() => setZoom(ZOOMS[Math.min(ZOOMS.length - 1, zi + 1)])} disabled={zi >= ZOOMS.length - 1} aria-label="Zoom in">
            +
          </button>
          <span aria-hidden className="mx-1 h-4 w-px bg-line-strong" />
          <a href={text.pdf} target="_blank" rel="noopener" className="pdf-btn !w-auto px-2.5 font-mono text-[0.68rem] tracking-wide whitespace-nowrap uppercase">
            PDF ↗
          </a>
        </div>
      </div>

      <div ref={scroller} className="pdf-scroll" tabIndex={0} aria-label="Manuscript pages">
        {status !== "ready" && (
          <div className="grid h-full place-items-center p-8 text-center">
            {status === "error" ? (
              <p className="max-w-sm text-sm leading-relaxed text-ink-2">
                The page reader could not load here.{" "}
                <a className="link text-ink" href={text.pdf} target="_blank" rel="noopener">
                  Open the manuscript PDF
                </a>{" "}
                instead.
              </p>
            ) : (
              <div role="status">
                <span className="pdf-sheet" aria-hidden />
                <p className="mt-4 font-mono text-[0.72rem] tracking-wide text-ink-3 uppercase">Opening the manuscript…</p>
              </div>
            )}
          </div>
        )}
        {doc &&
          width > 0 &&
          Array.from({ length: doc.numPages }, (_, i) => (
            <PdfPage key={`${i}-${zoom}-${width}`} doc={doc} n={i + 1} width={Math.max(260, (width - 32) * zoom)} root={scroller} />
          ))}
      </div>
      <p className="border-t border-line bg-pale px-4 py-2.5 text-[0.78rem] leading-relaxed text-ink-3">
        <span className="font-medium text-ink-2 sm:hidden">{text.version}. </span>
        {text.note}
      </p>
    </div>
  );
}

/** One page: a placeholder of the right shape until it nears the viewport, then a canvas. */
function PdfPage({ doc, n, width, root }: { doc: PDFDocumentProxy; n: number; width: number; root: React.RefObject<HTMLDivElement | null> }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ratio, setRatio] = useState(1.414);
  const [visible, setVisible] = useState(false);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    let live = true;
    doc.getPage(n).then((p) => {
      const v = p.getViewport({ scale: 1 });
      if (live) setRatio(v.height / v.width);
    });
    return () => {
      live = false;
    };
  }, [doc, n]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => e.some((x) => x.isIntersecting) && setVisible(true), { root: root.current, rootMargin: "1200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [root]);

  useEffect(() => {
    if (!visible) return;
    let task: { cancel: () => void } | null = null;
    let live = true;
    doc.getPage(n).then((p) => {
      const c = canvas.current;
      if (!live || !c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const viewport = p.getViewport({ scale: (width / p.getViewport({ scale: 1 }).width) * dpr });
      c.width = Math.floor(viewport.width);
      c.height = Math.floor(viewport.height);
      const t = p.render({ canvas: c, viewport });
      task = t;
      t.promise.then(() => live && setDrawn(true)).catch(() => {});
    });
    return () => {
      live = false;
      task?.cancel();
    };
  }, [visible, doc, n, width]);

  return (
    <div ref={box} data-page={n} className="pdf-page" style={{ width, height: width * ratio }}>
      <canvas ref={canvas} aria-label={`Page ${n}`} role="img" className={drawn ? "opacity-100" : "opacity-0"} />
      {!drawn && <span className="pdf-page-num">{n}</span>}
    </div>
  );
}
