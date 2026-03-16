# Mystic Oasis — Portfolio

A space-themed interactive portfolio built with React, Three.js, and GSAP. Inspired by *The Three-Body Problem* novel, the site features a live N-body gravitational simulation as the hero, with scroll-driven animations throughout.

**Live:** [akhilesh-portfolio-ten-tan.vercel.app](https://akhilesh-portfolio-ten-tan.vercel.app)

---

## Owner

**Akhilesh Bhute** — Pre-Final Year, Computer Science, Manipal University Jaipur
Open to Work · CGPA 9.1/10 · 3× Dean's List · Deloitte Ideathon Finalist

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build Tool | Vite 5 |
| 3D Rendering | Three.js + `@react-three/fiber` + `@react-three/drei` |
| Post-processing | `@react-three/postprocessing` (Bloom, ChromaticAberration, Vignette) |
| Animations | GSAP 3 + ScrollTrigger, Framer Motion |
| Styling | Tailwind CSS + inline styles |
| Font | Orbitron (Google Fonts) |
| WebGL BG | OGL-based custom particle system |

---

## Features

- **Live 3-body gravitational simulation** — Creator Star (amber), Destroyer Star (crimson), Home Planet (teal) with custom Euler integration physics
- **Scroll-driven camera** — hero zoom-out and planet scatter triggered by scroll progress
- **Orbital trails** — glowing trail lines behind each body
- **Custom crosshair cursor** — space-themed target cursor
- **Interactive sections** — About Me, Experience (Tech Mahindra, Deloitte, Glitch Club), Projects, Blog, Information
- **Circular tech gallery** — WebGL-rendered rotating gallery of tech stack logos
- **Asteroid belt** — animated asteroid field in the Experience section
- **LaserFlow / LightRays** — atmospheric visual effects between sections

---

## Project Structure

```
src/
├── App.tsx                  # Root — wires SpaceScene + HUDOverlay + ScrollSections
├── components/
│   ├── SpaceScene.tsx       # R3F Canvas + physics scene + scroll camera
│   ├── HUDOverlay.tsx       # Fixed nav, hero name, typewriter
│   ├── ScrollSections.tsx   # All content sections
│   ├── CreatorStar.tsx      # Amber body
│   ├── DestroyerStar.tsx    # Crimson body
│   ├── HomePlanet.tsx       # Teal body
│   ├── OrbitalTrails.tsx    # Glowing trails
│   ├── AsteroidBelt.tsx     # Experience section asteroid field
│   ├── CircularGallery.jsx  # OGL WebGL rotating gallery
│   ├── Particles.tsx        # OGL star-field background
│   └── TargetCursor.tsx     # Custom crosshair cursor
└── hooks/
    └── usePhysics.ts        # N-body gravitational physics
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Experience

| Company | Role | Period |
|---|---|---|
| Tech Mahindra | Software Developer Intern | June – Aug 2025, Pune |
| Deloitte | Industry Capstone Project | Oct 2025 – Jan 2026, Remote |
| Glitch Club MUJ | Event Management | Ongoing |

---

## Contact

- **GitHub:** [github.com/Ashthespycodes](https://github.com/Ashthespycodes)
- **LeetCode:** [leetcode.com/u/AshTheSpy](https://leetcode.com/u/AshTheSpy/)
- **Resume:** available at `/resume.pdf` on the live site
