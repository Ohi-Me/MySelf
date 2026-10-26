# Rohit Kumar · research and engineering portfolio

A static Next.js site that documents research, projects and results with the evidence behind every number.
Each project can be read five ways (30-second overview, plain English, engineering, research and evaluation,
recruiter summary) and every paper states its exact status. Every project and paper also has an animated pipeline,
the problems it resolved and where it applies in practice, and every paper can be read in place as a manuscript
sheet with its version history ("What we updated"), on its own page or expanded inline on `/research`. Where the
full text may be shown, the latest manuscript PDF (in `public/papers/`) is drawn page by page on the paper's page
with PDF.js. Each ML competition on `/competitions` has the same pipeline, problems resolved and impact.

## Run it

Requires Node.js 20.9+ and pnpm.

```bash
pnpm install
pnpm dev                 # http://localhost:3000
```

Checks (all must pass before a deploy):

```bash
pnpm typecheck           # route types + TypeScript
pnpm lint                # ESLint (Next.js core-web-vitals + TypeScript rules)
pnpm build               # production build; also validates all content (see below)
pnpm start --port 3002   # serve the build, then in a second terminal:
pnpm check:site http://localhost:3002   # every sitemap page: status, one h1, unique title and
                                        # description, canonical, og:image, JSON-LD, internal links,
                                        # #anchors, noopener, 404 page
pnpm check:links         # the same plus every external link
```

## Deploy

The whole site prerenders to static output (`ensureStatic = "navigation"` in the root layout makes the build fail if
any route stops being static).

1. Push this folder to a GitHub repository.
2. Import it on Vercel (framework preset: Next.js; no other settings needed).
3. Set the environment variable `NEXT_PUBLIC_SITE_URL` to the final domain, for example `https://example.com`.
   It is used for canonical URLs, the sitemap, robots.txt, Open Graph images and JSON-LD. Without it, Vercel's
   production URL is used, and a local build uses `http://localhost:3000`.
4. Redeploy after changing the domain so canonical URLs are regenerated.

## Architecture

```
src/
├── app/                         routes (App Router, all statically prerendered)
│   ├── page.tsx                 /            home
│   ├── research/                /research, /research/[slug]      papers, manuscripts, dataset
│   ├── projects/                /projects, /projects/[slug]      filterable list, five-mode case studies
│   ├── experience/ skills/ about/ contact/
│   ├── opengraph-image.tsx      site card; [slug]/opengraph-image.tsx per project and paper
│   └── sitemap.ts robots.ts icon.svg not-found.tsx error.tsx
├── content/                     ALL content lives here, as typed TypeScript
│   ├── types.ts                 the content model (Project, Paper, Block, Metric, ...)
│   ├── index.ts                 registry + build-time validation
│   ├── site.ts                  profile, education, experience, skills, ratings
│   ├── projects/*.ts            one file per project
│   └── papers/*.ts              papers, manuscripts, dataset
├── components/
│   ├── content/                 block renderer, KaTeX math, metric cards, evidence/status tags
│   ├── story/                   animated pipeline, problems resolved, where it applies
│   ├── diagrams/                spec-driven HTML diagrams (specs.ts holds every diagram)
│   ├── charts/                  dependency-free dumbbell and bar charts
│   └── project/ research/ home/ site/
└── lib/                         SEO helpers, search index, OG card
scripts/check-site.mjs           crawler used by check:site and check:links
```

Design: near-black ink on a scale of neutral ivory creams (hue about 48°, no red or brown cast), defined as
primitives (`--cream-50` … `--cream-600`, `--ink-900` … `--ink-500`) with semantic aliases (`--paper`, `--surface`,
`--pale`, `--ink`, ...) that components use; the dark theme inverts it to cream ink on neutral black. Every text
pair meets WCAG AA. The home page avoids box grids: key figures run as a ticker, research themes and the record are
ruled rows, and featured projects are sheets that stack as you scroll, each with its pipeline. Distinctions are
encoded by structure (filled, outlined, dashed, dotted), never by hue. Typography: IBM Plex Sans and Plex Mono (self-hosted by
`next/font`). Motion is CSS only: animated pipelines (a token travels the rail and lights each stage; a container query switches
them between vertical and horizontal), a reading-progress line on the manuscript sheet, staggered entrances, scroll-driven reveals (`animation-timeline: view()` where
supported), draw-in diagrams and charts, a sliding tab indicator, and native view transitions between routes
(project titles morph from card to page). All motion is disabled under `prefers-reduced-motion`, and no content
waits on JavaScript. Runtime dependencies beyond Next.js and React: KaTeX (runs at build time) and PDF.js
(`pdfjs-dist`, loaded only when a manuscript reader scrolls into view; the PDF link is the fallback).

## Adding content

**A project:** copy an existing file in `src/content/projects/`, fill in every field of the `Project` type, import
it in `src/content/index.ts` and add it to the `projects` array. The page, card, search entry, sitemap entry,
Open Graph image and JSON-LD are generated from it.

**Every project and paper** also needs `pipeline` (3 to 7 stages), `resolved` (issue and resolution pairs) and
`impact` (areas where the work could help, written as possible uses, not as deployments). Papers also need
`revisions`, the manuscript's version history, newest first.

**A paper:** the same with `src/content/papers/` and the `papers` array. Use `status` exactly:
`published`, `accepted`, `submitted`, `under-review`, `preprint`, `manuscript` (complete, not submitted),
`in-progress`, `dataset`. Give `abstract` only when it may be public; otherwise give `disclosure`.

**Long-form text** is a list of blocks: `p`, `list`, `table`, `equation` (KaTeX), `code`, `metrics`, `callout`,
`diagram` (an id from `components/diagrams/specs.ts`), `chart`, `steps`, `kv`, `h3`. Inline text supports
`**bold**`, `` `code` ``, `[label](url)` and `$math$`.

**Every number** is a `Metric` with `measures`, `method`, `source` and an evidence `kind`
(`held-out`, `validation`, `leaderboard`, `exploratory`, `simulation`, `measured`, `reported`). The kind is shown on
the card so held-out, validation and leaderboard numbers are never confused.

**Validation** runs on every build (`src/content/index.ts`): unique kebab-case slugs, related slugs that exist,
https links, unique section ids, provenance on every metric, no DOI on unpublished work, an abstract or a
disclosure note on every unpublished paper, a pipeline, resolved issues and impact on every entry, a version
history on every paper, and a list of claims that must never appear (for example "34 states",
a CPRI appointment, a patent, a medal).

## Sources

Every fact comes from the author's records: the public GitHub repositories under `github.com/Ohi-Me`, the
RE-FUSED results and manuscripts, the academic CV and the competition logs. Content was checked against them on
26 October 2026.

## License

The source code is under the MIT License. The written content, the CV and the images are © Rohit Kumar, all rights
reserved. See [LICENSE](LICENSE).
