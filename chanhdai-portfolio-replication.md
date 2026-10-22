# Replicating chanhdai.com — Full Spec

Sources: the live site (https://chanhdai.com) and the public repo (https://github.com/ncdai/chanhdai.com).
Items marked **[verify]** are inferred from the rendered page, not read from source. Open the repo to confirm exact values.

---

## 0. Fastest path (recommended)

The repo is **MIT licensed** — code and writing are free to fork. Only his **name and logo** are covered by a trademark policy (`TRADEMARK.md`). His README says to remove all personal info and swap branding before publishing.

```bash
git clone https://github.com/ncdai/chanhdai.com.git my-portfolio
cd my-portfolio
cat .nvmrc            # use this Node version
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

Read these repo files first: `README.md`, `DEVELOPMENT.md`, `AGENTS.md`, `CLAUDE.md`, `TRADEMARK.md`, `package.json`, `components.json`, `registry.json`, `next.config.ts`.

Then replace: name, avatar, bio, social links, experience, education, projects, awards, testimonials, sponsors, analytics IDs, OG images, domain.

---

## 1. Tech stack (from site footer + README)

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) — footer shows `next@16.3.5` |
| UI lib | React 19 (`react@19.3.0`) |
| Primitives | `@base-ui/react@1.8.0` (also Radix UI listed in stack) |
| Components | shadcn/ui (`shadcn@4.12.0` CLI) |
| Styling | Tailwind CSS v4 (`tailwindcss@4.3.3`) |
| Animation | Motion (motion.dev) |
| Font | **Geist** (Sans + Mono) |
| Content | MDX (blog + component docs, unified content layer) |
| Package mgr | pnpm (workspace file present) |
| Lint/format | ESLint, Prettier, Husky, lint-staged |
| Tests | Vitest |
| Analytics | OpenPanel + Google Analytics |
| Hosting | Vercel |
| Registry | Custom shadcn registry (`registry.json`, output in `public/r`) — 69 items |

Other tools on his stack list: Bun, Expo, TanStack, MobX-State-Tree, PostgreSQL, MongoDB, Redis, nginx, Docker, Figma, Paper.

---

## 2. Feature checklist (README "Featured")

- Clean, modern design
- Light/Dark themes (theme-color `#ffffff` in light)
- vCard download integration
- SEO: JSON-LD schema, sitemap, robots
- AI-ready: `/llms.txt` and `/index.md` (markdown version of home page)
- Spam-protected email (obfuscated / click-to-reveal)
- Installable PWA (manifest + icons)
- OpenPanel analytics
- MDX content: raw `.mdx` endpoints, syntax highlighting, dynamic OG images, RSS feed
- Registry: live preview, code snippets, one-click install commands (pnpm / npm / yarn / bun)
- Command palette (`⌘K` / `Ctrl K`) with search
- GitHub stars badge in header (fetched from GitHub API)
- Footer shows git commit hash, build date, registry item count

---

## 3. Site map / routes

```
/                       Home (portfolio)
/components             Component registry index
/components/[slug]      Component doc page (preview + code + install)
/blocks                 Blocks index
/blocks/[category]/[slug]   e.g. /blocks/marketing/social-proof-01
/craft                  Craft/experiments
/blog                   Blog index
/blog/[slug]            Blog post (MDX)
/sponsors               Sponsors page
/testimonials           All testimonials ("All builders")
/llms.txt               LLM-readable index
/index.md               Markdown of home page
/r/*.json               shadcn registry JSON (public/r)
/rss.xml                RSS feed [verify path]
/sitemap.xml, /robots.txt
```

---

## 4. Header / navigation

- Left: logo/monogram `/` linking home
- Center/Right nav: **Components · Blocks · Craft · Blog · Sponsors**
- Search button: placeholder `Search…` with `⌘K` / `Ctrl K` hint → opens Command Palette ("Search for a command to run...")
- GitHub star count pill (e.g. "2.4k GitHub stars")
- Theme toggle (light/dark)
- Sticky/blurred header [verify]

---

## 5. Home page — section order (top → bottom)

### 5.1 Hero / Profile header
- Caption "Fig. 1." (editorial figure-style caption) with hint text: "follows your cursor" / "click for a sound" — i.e. an interactive element that tracks the cursor and plays a sound on click
- Avatar: two images, swapped by theme
  - Light: sketch-style avatar
  - Dark: Ghibli-style avatar
- `h1`: **Name**
- Tagline: *Creating with code. Small details matter.*

### 5.2 Social links (icon buttons, with `?utm_source=chanhdai.com`)
X · GitHub · LinkedIn · Discord · YouTube — plus a small "follow me" hint label.

### 5.3 Overview (icon + text rows)
- Job title @ Company (links anchor to `#experience-<slug>`)
- Second role @ Company
- Location linked to Google Maps search: `https://www.google.com/maps/search/?api=1&query=<encoded location>`

### 5.4 GitHub contributions
- Contribution heatmap (calendar grid), levels 0–4 ("Less … More")
- Caption "Fig. 2." with total contributions and date range, source GitHub
- Data source: GitHub contributions API/scraper [verify] — alternatives: `github-contributions-api`, GraphQL `contributionsCollection`
- Below it: analytics cards (Visitors, Sessions, Views, Duration) with % change vs previous period + a daily line/area chart, "Fig. 3." caption, source OpenPanel (Metrics 01 block style)

### 5.5 About
- Short heading "About" with a small greeting ("Hello")
- 3 bullet paragraphs: who you are + years of experience; what you're passionate about; what you've created (with linked projects and metrics)

### 5.6 "Proudly supported by"
- Logo row/marquee of sponsors/programs (Vercel, 1Password, Claude, OpenPanel, Mintlify, PostHog, Nixtla, shadcn/studio, shadcncraft, Shadcnblocks) + "big thanks" label
- Logos are SVGs served from an assets CDN (`assets.chanhdai.com/images/sponsors/*.svg`)

### 5.7 Testimonials — "Trusted by top builders on 𝕏"
- Horizontal marquee/carousel of quote cards
- Card = quote text, avatar, name (links to the tweet), role/company
- "All builders" link → `/testimonials`

### 5.8 Components (count)
- Section heading with count, tagline "free to copy / yours to keep"
- Grid of ~12 component cards (name → `/components/<slug>`), link "All components"

### 5.9 Blocks (count)
- Tagline "same deal, bigger pieces"
- Cards: title + one-line description; link "All blocks"

### 5.10 Blog (count)
- Cards: cover image (webp), title, "New" badge for recent, "Published on" date; link "All posts"

### 5.11 Stack
- Numbered categories (01 Language, 02 Frontend, 03 Backend & Database, 04 Workflow & AI, 05 Analytics, 06 Design)
- Each item = icon + name linking to the tool's site

### 5.12 Experience
Per company:
- Logo, company name (link), location + location type (Remote/On-site), employment status
- Roles nested under company, each with: title, employment type, period (`MM.YYYY—MM.YYYY` or `—` for current), computed duration (e.g. `2y 8m`), bullet list, skill tag chips
- "Show more / Show less" toggle collapses older entries
- Each company has an anchor id like `experience-quaric`

### 5.13 Education
- School, study period, degree, field of study, skill tags

### 5.14 Projects (count)
- Title, period, URL, description (supports inline links), bullet highlights, tag chips
- "Show more / Show less"

### 5.15 Recognition (count)
- Awards / trademarks / certificates: title (link to credential), type, issuer (`@Issuer`), date, prize/grade
- "Show more / Show less"

### 5.16 "Backed by the community"
- Sponsor logo grid + GitHub Sponsors link + "All sponsors" → `/sponsors`

### 5.17 Footer
- Site name + one-line description
- Crafted by `@handle`
- Build: short commit SHA (links to commit), Date (build date), Registry: N items
- Deployed on ▲Vercel, Source code (GitHub), License (MIT)
- Typeface: Geist
- Stack with exact versions (generated from `package.json`)
- Analytics links
- "For agents": `llms.txt`, `index.md`
- "Inspired by" numbered list: Tailwind CSS, shadcn/ui, Vercel, Evil Charts, Devouring Details, Skiper UI, Making Software, shadcncraft
- Socials row + DMCA badge

---

## 6. Design language (observed) **[verify exact tokens]**

- Editorial / blueprint look: thin 1px borders, subtle grid/line patterns, "Fig. N." captions in mono type
- Neutral palette (zinc/neutral), minimal accent colour; high contrast text; muted secondary text
- Geist Sans for UI, Geist Mono for captions/numerics/labels
- Max content width ≈ 800px centered, with vertical guide lines on the sides (lined layout)
- Section headers with count badges, e.g. `Components (42)`
- Small, precise micro-interactions: hover states, focus rings, springy Motion animations
- Both themes fully designed; images swap per theme (`dark:hidden` / `hidden dark:block`)
- Tailwind v4: CSS-first config via `@theme` in `globals.css`; design tokens as CSS variables (shadcn style: `--background`, `--foreground`, `--border`, `--muted`, etc.)

---

## 7. Suggested folder structure (matches repo conventions)

```
src/
  app/
    (app)/page.tsx            # home
    (app)/components/...
    (app)/blocks/...
    (app)/blog/...
    (app)/craft/...
    (app)/sponsors/page.tsx
    (app)/testimonials/page.tsx
    llms.txt/route.ts
    index.md/route.ts
    sitemap.ts, robots.ts, manifest.ts
    opengraph-image.tsx
  components/                 # shadcn + custom UI
  features/portfolio/         # overview, about, experience, education, projects, awards, stack, testimonials
  config/site.ts              # name, url, links, OG, keywords
  data/                       # experience.ts, education.ts, projects.ts, awards.ts, stack.ts, testimonials.ts, sponsors.ts
  content/                    # *.mdx (blog + component docs)
  lib/                        # utils, github, openpanel, vcard
public/
  r/                          # built registry JSON
  fonts/ icons/ manifest
registry.json
components.json
```

---

## 8. Data model (replace with yours)

```ts
type Experience = {
  id: string;                    // anchor: experience-<id>
  company: string; logo: string; url?: string;
  location: string; locationType: "Remote" | "On-site" | "Hybrid";
  current?: boolean;
  positions: {
    title: string;
    employmentType: "Full-time" | "Part-time" | "Contract" | "Internship";
    start: string;               // "01.2026"
    end?: string;                // omit = present
    bullets?: string[];
    skills: string[];
  }[];
};

type Education = { school: string; start: string; end: string; degree?: string; field?: string; skills: string[] };

type Project = { title: string; start: string; end?: string; url: string; description?: string; bullets?: string[]; tags: string[] };

type Award = { title: string; url?: string; type: "Award" | "Certificate" | "Trademark"; issuer?: string; date: string; prize?: string };

type Testimonial = { quote: string; name: string; role: string; avatar: string; url: string };
```

Duration helper: compute months between `start` and `end/now` → format `Xy Ym`.

---

## 9. SEO / metadata (copy this pattern)

```
title: "<Name> – <Role>"
description: "<tagline>"
keywords: name variants, handles
og:type: profile
og:image: 1200×630 (light + dark variants)
twitter:card: summary_large_image
profile:first_name / last_name / username / gender
theme-color: #ffffff
viewport: width=device-width, initial-scale=1, viewport-fit=cover
canonical: https://yourdomain.com
```

Add JSON-LD `Person` schema, `sitemap.ts`, `robots.ts`, `manifest.ts` (PWA), RSS, and `/llms.txt` + `/index.md`.

---

## 10. Build order if starting from scratch

1. `pnpm create next-app@latest` (TS, Tailwind, App Router) → `pnpm dlx shadcn@latest init`
2. Add Geist font, theme provider (`next-themes`), tokens in `globals.css`
3. Layout: header, footer, max-width lined container
4. Data files + home sections in the order of §5
5. Command palette (shadcn `Command`) + search index
6. MDX pipeline (blog + docs) — `@next/mdx` or Contentlayer/Velite alternative, `rehype-pretty-code` / Shiki
7. GitHub contributions graph + OpenPanel stats
8. Registry: `registry.json` + `pnpm dlx shadcn build` → `public/r`
9. SEO, OG image route, PWA, RSS, llms.txt
10. Analytics, deploy to Vercel

---

## 11. Assets you must recreate (don't hotlink his)

- Avatars (light + dark), OG images, company/sponsor logos, blog cover images, testimonial avatars — all hosted on his CDN (`assets.chanhdai.com`). Use your own.
- Sound effect for the hero click interaction.

---

## 12. Legal / etiquette

- Code & writing: MIT — keep the LICENSE notice.
- His **name, logo, avatar, testimonials, awards, and bio are personal** — remove them.
- Don't reuse his testimonials or sponsor logos unless they are yours.
- Credit/link back is appreciated.
