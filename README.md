<div align="center">

# Shawon.dev

### Engineering Portfolio & Systems Showcase

**Built, designed, and developed by [MD Shawon Molla](https://github.com/shawon2210)**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-4CD964?style=flat-square)](LICENSE)

[Live Site](https://oddboundary.lovable.app) · [Source Code](https://github.com/shawon2210/Portfolio-SHAWON) · [Report an Issue](https://github.com/shawon2210/Portfolio-SHAWON/issues)

</div>

---

## Preview



---

## About

This is the personal engineering portfolio of **MD Shawon Molla** — a software engineer
based in Dhaka, Bangladesh, focused on high-scale systems, LLM-backed applications, and
microservices.

Rather than a static résumé, this is a single-page application that presents the work as a
live product: a real-time WebGL background, scroll-driven transitions, a filterable project
catalogue with per-project case-study modals, an interactive terminal, and a print-optimised
document view.

The entire interface, from the component architecture to the design system, was written
from scratch and is maintained by its author.

---

## Highlights

| Capability | Details |
| --- | --- |
| **Real-time 3D background** | WebGL particle field built with Three.js, lazily loaded so it never blocks first paint |
| **Motion system** | Scroll-linked and enter/exit animations via `motion` (Framer Motion) |
| **Four routed views** | Home, Projects, Experience, and Contact — driven by URL hash |
| **Project catalogue** | 6 projects with category filtering and full-text stack search |
| **Case-study modals** | Per-project architecture breakdown, metrics, and tech-stack chips |
| **Experience timeline** | 2 roles, 3 education entries, and 2 certifications in a single tabbed view |
| **Skills matrix** | 6 disciplines spanning languages, frontend, backend, data, AI/ML, and DevOps |
| **Print view** | Dedicated print-optimised layout for exporting a PDF résumé |
| **Interactive terminal** | Simulated shell modal with a themed, keyboard-driven command line |
| **Resume modal** | In-app CV viewer requiring no page navigation |
| **Clipboard + toasts** | Copy-to-clipboard for contact details with transient feedback |
| **SEO utilities** | Per-view document title and meta-description management |
| **Dev-only image upload** | Avatar replacement is compiled out of production builds via `import.meta.env.DEV` |
| **Print + copy in view** | Context-aware actions that switch behaviour depending on the active tab |

---

## Tech Stack

### Core

| Technology | Version | Purpose |
| --- | --- | --- |
| [React](https://react.dev) | 19 | UI runtime and component model |
| [TypeScript](https://www.typescriptlang.org) | 5.x | Static typing across views, components, and data |
| [Vite](https://vite.dev) | 8 | Dev server, HMR, and production bundling |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first styling and design tokens |

### Libraries

| Library | Purpose |
| --- | --- |
| [motion](https://motion.dev) | Declarative animation, layout transitions, and scroll springs |
| [three](https://threejs.org) | WebGL background scene and 3D tech canvas |
| [lucide-react](https://lucide.dev) | Tree-shaken SVG icon set, mapped centrally by `AppIcon` |

---

## Project Structure

```
.
├── docs/                      # Documentation assets
│   └── preview-home.png
├── public/                    # Static assets served at the root path
├── src/
│   ├── components/            # Reusable UI
│   │   ├── AppIcon.tsx        # Central semantic-name → lucide icon mapper
│   │   ├── BackgroundScene.tsx# Three.js particle background (lazy-loaded)
│   │   ├── BottomNav.tsx      # Mobile-first navigation
│   │   ├── Header.tsx         # Desktop navigation and global actions
│   │   ├── ImageUploadModal.tsx
│   │   ├── PrintablePortfolio.tsx  # Print-optimised résumé layout
│   │   ├── ProjectDetailModal.tsx
│   │   ├── ResumeModal.tsx
│   │   ├── TechCanvas3D.tsx   # Interactive 3D skills canvas
│   │   ├── TerminalModal.tsx  # Simulated command line
│   │   └── Toast.tsx          # Transient notifications
│   ├── data/
│   │   └── portfolioData.ts   # Single source of truth for all content
│   ├── utils/
│   │   └── seo.ts             # Per-view document metadata
│   ├── views/
│   │   ├── ContactView.tsx
│   │   ├── ExperienceView.tsx
│   │   ├── HomeView.tsx
│   │   └── ProjectsView.tsx
│   ├── App.tsx                # Shell, routing, and global state
│   ├── index.css              # Tailwind entry point and design tokens
│   ├── main.tsx               # React entry point
│   └── types.ts               # Shared TypeScript interfaces
├── .env.example
├── index.html
├── tsconfig.json
└── vite.config.ts
```

All portfolio content lives in `src/data/portfolioData.ts` and is strongly typed against
`src/types.ts`, so the UI never hard-codes copy.

---

## Getting Started

### Prerequisites

- **Node.js** `^20.19.0 || >=22.12.0` (required by Vite 8)
- **npm** 10 or newer

> **No API keys are required.** The application is fully static and runs entirely in the
> browser. Any `.env` files left over from an earlier scaffold can be deleted.

### Installation

```bash
git clone https://github.com/shawon2210/Portfolio-SHAWON.git
cd Portfolio-SHAWON
npm install
```

### Development

```bash
npm run dev
```

The dev server starts on **http://localhost:3000** and binds to `0.0.0.0` so the site is
reachable from other devices on your local network. If port 3000 is already taken, Vite
falls back to the next available port and prints it in the terminal.

### Production build

```bash
npm run build      # type-checks nothing, bundles to dist/
npm run preview    # serves the production build locally
```

### Type checking

```bash
npm run lint       # tsc --noEmit
```

---

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR on port 3000 |
| `npm run build` | Produce an optimised production bundle in `dist/` |
| `npm run preview` | Locally serve the built production bundle |
| `npm run lint` | Run TypeScript in no-emit mode to catch type errors |
| `npm run clean` | Remove build output and generated server files |

---

## Customisation

Content is fully data-driven. To update the portfolio, edit `src/data/portfolioData.ts`:

- `PERSONAL_INFO` — name, title, location, and social links
- `PROJECTS` — case studies shown in the Projects view
- `WORK_EXPERIENCE` — roles and achievements in the Experience view
- `EDUCATION_LIST` / `CERTIFICATES` — academic and professional credentials
- `SKILL_CATEGORIES` — the skills matrix

The theme (colours, fonts, spacing) is defined as Tailwind tokens in `src/index.css`.

---

## Browser Support

Modern evergreen browsers: Chrome, Edge, Firefox, and Safari (current and previous
versions). The viewport meta tag allows user zoom, and the layout is responsive from
320px mobile viewports through large desktops.

---

## Author

<div align="center">

### **MD Shawon Molla**

**Junior Software Engineer · Full-Stack Developer · AI-Integrated Web Applications**

[![GitHub](https://img.shields.io/badge/GitHub-shawon2210-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/shawon2210)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-md--shawon--molla-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/md-shawon-molla-2a3877293)

📍 Dhaka, Bangladesh
✉️ [22103330@iubat.edu](mailto:22103330@iubat.edu)

</div>

---

## License

Copyright © 2026 **MD Shawon Molla**. All rights reserved.

This project is released under the [MIT License](LICENSE).

---

<div align="center">

**Designed, engineered, and maintained by MD Shawon Molla.**

</div>
