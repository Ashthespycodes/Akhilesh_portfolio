# CLAUDE.md — Mystic Oasis Portfolio

## Project Identity
- **Owner:** Akhilesh Bhute (CS, Manipal University Jaipur — Pre-Final Year)
- **Project name:** `mystic-oasis-portfolio`
- **Theme:** Space / 3-body problem — inspired by *The Three-Body Problem* novel
- **Three bodies:** Creator Star (amber), Destroyer Star (crimson), Home Planet (teal/blue-green)
- **Star system name:** Mystic Oasis

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build tool | Vite 5 |
| 3D rendering | Three.js + `@react-three/fiber` + `@react-three/drei` |
| Post-processing | `@react-three/postprocessing` (Bloom, ChromaticAberration, Vignette) |
| Animations | GSAP 3 + ScrollTrigger, Framer Motion, Lenis |
| Styling | Tailwind CSS + inline styles (space-themed, no CSS modules) |
| Font | `Orbitron` (Google Fonts) — used exclusively everywhere |
| Cursor | Custom `TargetCursor` component; interactive targets use `.cursor-target` class |
| Particle BG | Custom `Particles` component (OGL-based WebGL) |

---

## Project Structure

```
src/
├── App.tsx                     # Root — wires SpaceScene + HUDOverlay + ScrollSections
├── main.tsx
├── index.css
├── hooks/
│   └── usePhysics.ts           # N-body gravitational physics (Euler integration)
└── components/
    ├── SpaceScene.tsx           # R3F Canvas + PhysicsScene + scroll-driven camera
    ├── HUDOverlay.tsx           # Fixed nav, hero name, typewriter, scroll hint
    ├── ScrollSections.tsx       # All content sections (About, Experience, Projects, Blog, Information)
    ├── LoadingScreen.tsx        # Initial loading gate
    ├── CreatorStar.tsx          # Amber body (body[0])
    ├── DestroyerStar.tsx        # Crimson body (body[1])
    ├── HomePlanet.tsx           # Teal body (body[2])
    ├── OrbitalTrails.tsx        # Glowing trail lines behind bodies
    ├── AsteroidBelt.tsx         # Animated asteroid belt in Experience section
    ├── RocketPath.tsx           # Rocket animation in profile section
    ├── Particles.tsx + .css     # OGL WebGL star-field background
    ├── TargetCursor.tsx + .css  # Custom crosshair cursor
    ├── LogoLoop.jsx + .css      # Infinite scrolling skill logo ticker
    ├── ProfileCard.jsx + .css   # Tilt card with profile image
    └── ScrollStack.jsx + .css   # (unused/auxiliary)
```

---

## Architecture & Key Patterns

### Scroll System
- **Hero spacer** (`#hero-spacer`, `height: 250vh`) owns the scroll-to-3D transition.
- `heroProgressRef` (0→1) is driven by GSAP `ScrollTrigger` in `App.tsx` and passed via ref to avoid re-renders.
- Inside `SpaceScene.tsx` → `PhysicsScene`, `useFrame` reads `heroProgressRef.current` every frame:
  - Phase 1 (0→0.40): camera Z zooms out 14→30 (smoothstep eased)
  - Phase 2 (0.40→1.0): planets scatter off-screen (yellow right, red left, teal left+delayed)
- Active nav section tracked via `IntersectionObserver` in `ScrollSections.tsx`.

### Physics
- Custom `usePhysics` hook — pure Euler integration, runs every `useFrame` tick.
- `G = 0.00667`, `DT = 0.016`, `TRAIL_LENGTH = 300`.
- Centre-of-mass correction applied every frame to prevent drift.
- HomePlanet (body[2]) has a soft leash (`MAX_DIST = 7.0`) to prevent ejection.

### Section Layout
Sections alternate between **white** (`#fff`) and **black** (`#020408`) backgrounds:
1. About Me → white
2. Profile/Stats dark block → black (`#020408`)
3. Experience → white
4. Black spacer
5. Projects → white
6. Black spacer
7. Blog → white
8. Black spacer
9. Information → near-black (`#050505`)

### Content Data (all in `ScrollSections.tsx`)
- `SECTIONS[]` — About Me, Projects, Blog text
- `EXPERIENCE_CARDS[]` — Tech Mahindra, Deloitte, Glitch Club
- `SKILL_LOGOS[]` — 13 logos from `cdn.simpleicons.org`
- `NAV_MAP` — section IDs → nav label mapping

### Navigation
- `NAV_TO_ID` in `App.tsx` maps nav labels to DOM IDs.
- Nav click → `window.scrollTo({ top: el.offsetTop, behavior: 'smooth' })`.
- Active nav highlighted in `#00F5D4` (teal accent).

---

## Design System

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| Background dark | `#020408` | Main dark bg |
| Background near-black | `#050505` | Cards, Experience section |
| Teal accent | `#00F5D4` | Active nav, borders, highlights |
| Blue accent | `#86E1F4` | Deloitte card |
| Purple accent | `#C4B5FD` | Glitch Club card |
| Orange accent | `#f97316` | Achievement dividers |
| Green stat | `#34d399` | CGPA, LeetCode |
| Pure white | `#ffffff` | Section backgrounds |
| Text dark | `#050505` / `#111` | Body text on white |

### Typography
- **Font:** Orbitron (sans-serif) — used for ALL text without exception.
- Section headings: `clamp(2.8rem, 7vw, 6.5rem)`, weight 900, `letterSpacing: '-0.02em'`, `lineHeight: 0.95`.
- Body text: `clamp(0.6rem, 1.05vw, 0.82rem)`, `lineHeight: 1.9`, `letterSpacing: '0.04em'`.
- Labels/overlines: `clamp(0.55rem, 1vw, 0.7rem)`, `letterSpacing: '0.35em'`, uppercase.

### Layout
- Max content width: `1200px`, centered with `margin: 0 auto`.
- Content padding: `0 8vw` (horizontal), `0 6vw` (some sections).
- Main grid: `1fr 1.6fr` (label left, content right) — About, Projects, Blog.
- Experience section: left `AsteroidBelt` + right card column.
- Profile section: `1fr 1fr` grid.

### Cursor
- All interactive elements use class `cursor-target` to trigger the custom crosshair.
- Custom cursor set to `cursor: none` on interactive elements.

---

## Owner Profile Data
- **Name:** Akhilesh Bhute
- **Handle:** `akhileshbhute`
- **University:** Manipal University Jaipur — Computer Science
- **Status:** Open to Work
- **CGPA:** 9.1/10
- **LeetCode:** 157 solved (80E / 72M / 5H), profile: `https://leetcode.com/u/AshTheSpy/`
- **Achievements:** 3× Dean's List, Deloitte Ideathon Finalist
- **Skills:** React, TypeScript, Python, Three.js, Node.js, TensorFlow, C++, GSAP, Docker, Git, SQL, Linux, PyTorch
- **Interests:** AI, full-stack, chess, badminton, games
- **Resume:** served at `/resume.pdf` (public folder)
- **Profile image:** `/profile.png` (public folder)

### Experience
1. **Tech Mahindra** — Software Developer Intern, June–Aug 2025, Pune
   - Full-stack marketplace for remanufactured engines
   - Node.js + Express + MongoDB, 40% process time reduction
2. **Deloitte** — Industry Capstone, Oct 2025–Jan 2026, Remote
   - AI-enabled mobile app for Alzheimer's/dementia patients
3. **Glitch Club** — Event Management, MUJ (Ongoing)

### Contact/Info (currently placeholder)
- Email: `contact@mysticoasis.dev` (placeholder)
- GitHub: `github.com/mysticoasis` (placeholder)
- Availability: Open to new missions Q1 2026

---

## Conventions & Rules

### Code Style
- **TypeScript everywhere** — `.tsx` for components, `.ts` for hooks/utilities.
- `.jsx` only for existing legacy components (`LogoLoop`, `ProfileCard`, `ScrollStack`) — do not create new `.jsx` files.
- Props interfaces defined inline above the component.
- No CSS modules — use inline styles for layout/spacing, Tailwind only for utility classes if needed.
- GSAP animations in `useEffect` with cleanup (`trigger.kill()` / tween cleanup).
- All scroll-driven values go through refs (`useRef`) — avoid state for per-frame values.

### Do
- Use `clamp()` for all font sizes to ensure responsiveness.
- Use `cursor-target` class on all interactive elements.
- Keep the Orbitron font for all visible text.
- Clean up GSAP ScrollTriggers and event listeners in `useEffect` return.
- Use `heroProgressRef` pattern (ref not state) for animation values read in `useFrame`.

### Don't
- Do not use `useState` for values that change every animation frame.
- Do not add new fonts — Orbitron only.
- Do not break the `#020408` / `#fff` alternating section pattern.
- Do not add `cursor: pointer` — use `cursor: none` on interactive items with `.cursor-target`.
- Do not commit large binary assets to the repo.

---

## Build & Dev Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc + vite build → dist/
npm run preview   # Preview production build
```

No test suite configured. TypeScript strict mode via `tsconfig.json`.

---

## Public Assets
```
public/
├── profile.png        # Profile photo
├── resume.pdf         # Resume download
├── tm-img1.jpg        # Tech Mahindra screenshot 1
├── tm-img2.jpg        # Tech Mahindra screenshot 2
└── (other images)     # WhatsApp images in root (not in public)
```

---

## Known Placeholders / TODOs
- `contact@mysticoasis.dev` and `github.com/mysticoasis` in Information section are placeholders — update with real links.
- Dean's List card has a placeholder image box (`IMG` text) — needs real certificate image.
- Projects section body text contains fictional projects (Graviton Engine, Nebula UI, etc.) — needs real project data.
- Blog section body text is fictional — needs real blog posts or links.
- `ScrollStack.jsx` is imported in the project but not used in `App.tsx`.
