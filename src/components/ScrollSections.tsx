import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LogoLoop from './LogoLoop'
import ProfileCard from './ProfileCard'
import RocketPath from './RocketPath'
import ScrollVelocity from './ScrollVelocity'
import LaserFlow from './LaserFlow'
import CircularGallery from './CircularGallery'
import LightRays from './LightRays'

gsap.registerPlugin(ScrollTrigger)

const SECTIONS = [
  {
    id: 'about-me',
    nav: 'About Me',
    label: 'ABOUT ME',
    sub: 'Pre-Final Year · Computer Science · Manipal University Jaipur',
    body: [
      'Pre-final year Computer Science student at Manipal University Jaipur with a strong passion for building efficient, scalable software solutions. I enjoy solving complex problems and approaching challenges with an intuitive, analytical mindset. My interests lie particularly in Artificial Intelligence and developing systems that can scale and adapt to real-world demands.',
      'Beyond academics, I actively explore new technologies through personal projects and continuous learning. I value clean design, thoughtful engineering, and practical innovation that bridges theory with real-world impact.',
      'Outside the world of code, I enjoy playing chess, badminton, and exploring games — which sharpen my strategic thinking, focus, and creativity, qualities that naturally translate into my approach to problem-solving and software development.',
    ],
  },
  {
    id: 'projects',
    nav: 'Projects',
    label: 'PROJECTS',
    sub: 'Active Deployments',
    body: [],
  },
  {
    id: 'blog',
    nav: 'Blog',
    label: 'BLOG',
    sub: 'Transmissions from the Void',
    body: [],
  },
]

/* ── Blog posts — populate via backend ── */
interface BlogPost {
  id: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  content: string[]  // each string is one paragraph
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Why I Think AI Is The Most Exciting Thing Happening Right Now',
    date: 'Mar 2026',
    tags: ['AI', 'Opinion', 'Technology'],
    excerpt: 'A personal take on why artificial intelligence genuinely excites me — not as hype, but as a fundamental shift in what humans can build.',
    content: [
      'Every time I build something with AI, I walk away surprised. That feeling — where the tool does something you did not fully expect — is rare in software, and it never really gets old.',
      'As a CS student, the impact I feel most directly is in how fast the feedback loop has become. I can prototype in an afternoon what would have taken a week before. That compression of time changes what is possible for a single developer with a laptop.',
      'What excites me even more is AI outside of software — drug discovery, protein folding, climate modelling. AlphaFold arguably did more for structural biology in one year than the previous decade combined. That scale of impact is hard to wrap your head around.',
      'I am not dismissing the risks — alignment, misinformation, power concentration are all real. But I think you can hold both things at once: govern it carefully, and still recognise it as one of the most remarkable things we have ever built. For me, it is the main reason I want to keep building.',
    ],
  },
]

const EXPERIENCE_CARDS = [
  {
    org: 'Tech Mahindra',
    role: 'Software Developer Intern',
    period: 'June 2025 – Aug 2025',
    location: 'Pune, India',
    type: 'Internship',
    accent: '#00F5D4',
    bullets: [
      'Architected and delivered a full-stack marketplace web application for remanufactured engines, reducing manual order processing time by 40% through automated workflows.',
      'Built RESTful APIs using Node.js and Express with MongoDB, handling 10+ data models and supporting concurrent multi-user inventory and transaction management.',
      'Engineered a responsive frontend interface that improved cross-device usability, contributing to sprint deliverables on time across 3 agile cycles.',
    ],
    images: [
      { src: '/techmPhoto.jpeg', alt: 'Tech Mahindra internship photo' },
      { src: '/techmID.jpeg', alt: 'Tech Mahindra internship ID' },
    ],
  },
  {
    org: 'Deloitte',
    role: 'Industry Capstone Project',
    period: 'Oct 2025 – Jan 2026',
    location: 'Remote',
    type: 'Capstone',
    accent: '#86E1F4',
    bullets: [
      'Developed an AI-enabled mobile app supporting Alzheimer\'s and dementia patients with Deloitte mentors.',
      'Collaborated in a team environment using professional development practices and version control with GitHub.',
      'Contributed to core app features, AI integration, and regular project reviews.',
      'Demonstrated strong teamwork, technical competence, and industry-standard professionalism.',
    ],
  },
  {
    org: 'Glitch Club',
    role: 'Event Management & Operations',
    period: 'Ongoing',
    location: 'Manipal University Jaipur',
    type: 'Club Leadership',
    accent: '#C4B5FD',
    bullets: [
      'Leading event management and operations for Glitch Club — planning, coordinating, and executing technical and creative events on campus.',
    ],
  },
]

const SKILL_LOGOS = [
  { src: 'https://cdn.simpleicons.org/react/61DAFB',         alt: 'React' },
  { src: 'https://cdn.simpleicons.org/typescript/3178C6',    alt: 'TypeScript' },
  { src: 'https://cdn.simpleicons.org/python/3776AB',        alt: 'Python' },
  { src: 'https://cdn.simpleicons.org/threedotjs/111111',    alt: 'Three.js' },
  { src: 'https://cdn.simpleicons.org/nodedotjs/339933',     alt: 'Node.js' },
  { src: 'https://cdn.simpleicons.org/tensorflow/FF6F00',    alt: 'TensorFlow' },
  { src: 'https://cdn.simpleicons.org/cplusplus/00599C',     alt: 'C++' },
  { src: 'https://cdn.simpleicons.org/greensock/88CE02',     alt: 'GSAP' },
  { src: 'https://cdn.simpleicons.org/docker/2496ED',        alt: 'Docker' },
  { src: 'https://cdn.simpleicons.org/git/F05032',           alt: 'Git' },
  { src: 'https://cdn.simpleicons.org/mysql/4479A1',         alt: 'SQL' },
  { src: 'https://cdn.simpleicons.org/linux/FCC624',         alt: 'Linux' },
  { src: 'https://cdn.simpleicons.org/pytorch/EE4C2C',       alt: 'PyTorch' },
]

const NAV_MAP: Record<string, string> = {
  'about-me':    'About Me',
  'experience':  'Experience',
  'projects':    'Projects',
  'blog':        'Blog',
  'information': 'Information',
}

interface ScrollSectionsProps {
  onSectionChange: (nav: string | null) => void
}

const topBar = <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#050505' }} />

function BlogSection() {
  const [selected, setSelected] = useState<BlogPost | null>(BLOG_POSTS.length > 0 ? BLOG_POSTS[0] : null)

  return (
    <div id="blog" style={{ position: 'relative', background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {topBar}

      {/* heading row */}
      <div style={{ padding: '5rem 8vw 2.5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.55rem, 1vw, 0.7rem)', letterSpacing: '0.35em', color: '#aaa', textTransform: 'uppercase' as const, marginBottom: '0.8rem' }}>
          Transmissions from the Void
        </p>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2.8rem, 7vw, 6.5rem)', fontWeight: 900, color: '#050505', lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0 }}>
          BLOG
        </h2>
        <div style={{ width: '48px', height: '3px', background: '#050505', marginTop: '1.5rem' }} />
      </div>

      {/* reader grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 0, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 8vw 5rem', alignItems: 'start' }}>

        {/* LEFT — post list */}
        <div style={{ borderRight: '1px solid #e8e8e8', paddingRight: '3vw', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {BLOG_POSTS.length === 0 ? (
            <div style={{ paddingTop: '1rem' }}>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.55rem, 0.9vw, 0.7rem)', color: '#bbb', letterSpacing: '0.1em' }}>
                No posts yet. Check back soon.
              </p>
            </div>
          ) : (
            BLOG_POSTS.map(post => {
              const active = selected?.id === post.id
              return (
                <button
                  key={post.id}
                  onClick={() => setSelected(post)}
                  className="cursor-target"
                  style={{
                    all: 'unset',
                    display: 'block',
                    padding: '1.1rem 1rem',
                    borderRadius: '8px',
                    background: active ? '#050505' : 'transparent',
                    cursor: 'none',
                    transition: 'background 0.18s',
                    borderLeft: active ? '3px solid #050505' : '3px solid transparent',
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#f5f5f5' }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.45rem, 0.7vw, 0.58rem)', letterSpacing: '0.25em', color: active ? '#00F5D4' : '#aaa', textTransform: 'uppercase' as const, margin: '0 0 0.35rem' }}>
                    {post.date}
                  </p>
                  <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.65rem, 1vw, 0.8rem)', fontWeight: 700, color: active ? '#fff' : '#111', margin: '0 0 0.4rem', lineHeight: 1.3 }}>
                    {post.title}
                  </p>
                  <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(0.6rem, 0.85vw, 0.72rem)', color: active ? '#aaa' : '#888', margin: '0 0 0.6rem', lineHeight: 1.5 }}>
                    {post.excerpt}
                  </p>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' as const }}>
                    {post.tags.map(tag => (
                      <span key={tag} style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.42rem', letterSpacing: '0.15em', color: active ? '#00F5D4' : '#999', border: `1px solid ${active ? '#00F5D444' : '#ddd'}`, borderRadius: '4px', padding: '0.2rem 0.5rem' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* RIGHT — post content */}
        <div style={{ paddingLeft: '3vw', paddingTop: '0.5rem' }}>
          {!selected ? (
            <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.55rem, 0.9vw, 0.7rem)', color: '#ccc', letterSpacing: '0.1em', marginTop: '1rem' }}>
              Select a post to read.
            </p>
          ) : (
            <>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.45rem, 0.7vw, 0.58rem)', letterSpacing: '0.3em', color: '#aaa', textTransform: 'uppercase' as const, marginBottom: '0.6rem' }}>
                {selected.date}
              </p>
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', fontWeight: 900, color: '#050505', letterSpacing: '-0.01em', lineHeight: 1.1, margin: '0 0 0.8rem' }}>
                {selected.title}
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const, marginBottom: '2rem' }}>
                {selected.tags.map(tag => (
                  <span key={tag} style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.45rem', letterSpacing: '0.15em', color: '#555', border: '1px solid #ddd', borderRadius: '4px', padding: '0.25rem 0.6rem' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                {selected.content.map((para, i) => (
                  <p key={i} style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(0.75rem, 1.05vw, 0.9rem)', lineHeight: 1.9, color: '#333', margin: 0 }}>
                    {para}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ScrollSections({ onSectionChange }: ScrollSectionsProps) {
  const expCardRefs = useRef<(HTMLDivElement | null)[]>([])
  const expSectionRef = useRef<HTMLDivElement>(null)
  const [crModalOpen, setCrModalOpen] = useState(false)

  useEffect(() => {
    const ids = ['about-me', 'experience', 'projects', 'blog', 'information']
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          const best = visible.reduce((a, b) =>
            a.intersectionRatio > b.intersectionRatio ? a : b
          )
          onSectionChange(NAV_MAP[best.target.id] ?? null)
        }
      },
      { threshold: [0.3, 0.5] }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [onSectionChange])

  // GSAP scroll-triggered experience cards using context for clean re-render cleanup
  useEffect(() => {
    const ctx = gsap.context(() => {
      expCardRefs.current.forEach((card) => {
        if (!card) return
        gsap.set(card, { opacity: 0, y: 80 })
        gsap.to(card, {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top 92%',
            end: 'top 55%',
            scrub: 1,
          },
        })
      })
    })
    return () => ctx.revert()
  }, [])


  return (
    <>
      {/* ── ABOUT ME ── */}
      <div
        id="about-me"
        style={{ position: 'relative', background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        {topBar}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1.6fr',
          gap: '6vw',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 8vw',
          width: '100%',
        }}>
          <div>
            <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.55rem, 1vw, 0.7rem)', letterSpacing: '0.35em', color: '#aaa', textTransform: 'uppercase', marginBottom: '1rem' }}>
              {SECTIONS[0].sub}
            </p>
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2.8rem, 7vw, 6.5rem)', fontWeight: 900, color: '#050505', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
              {SECTIONS[0].label.split(' ').map((word, wi) => (
                <span key={wi} style={{ display: 'block' }}>{word}</span>
              ))}
            </h2>
            <div style={{ width: '48px', height: '3px', background: '#050505', marginTop: '2rem' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
            {SECTIONS[0].body.map((line, li) => (
              <p key={li} style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.6rem, 1.05vw, 0.82rem)', lineHeight: 1.9, color: '#111', letterSpacing: '0.04em', paddingLeft: '1.2rem', borderLeft: '1.5px solid #ddd' }}>
                {line}
              </p>
            ))}
          </div>
        </div>
        <div style={{ flexShrink: 0, borderTop: '1px solid #e8e8e8', padding: '1.5rem 0', overflow: 'hidden', background: '#fff' }}>
          <LogoLoop
            speed={60}
            direction="left"
            gap={64}
            logoHeight={50}
            fadeOut
            fadeOutColor="#ffffff"
            pauseOnHover
            scaleOnHover
            logos={SKILL_LOGOS}
          />
        </div>
      </div>

      {/* shooting star keyframes injected once */}
      <style>{`
        @keyframes shoot-along {
          0%   { transform: translateX(-160px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(110vw);  opacity: 0; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50%       { opacity: 0.9; }
        }
        .star-dot {
          position: absolute;
          border-radius: 50%;
          background: #fff;
          animation: twinkle linear infinite;
        }
        .star-track {
          position: absolute;
          width: 120vw;
          height: 2px;
          pointer-events: none;
          overflow: visible;
        }
        .star-trail {
          position: absolute;
          top: 0; left: 0;
          width: 140px;
          height: 1.5px;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 55%, rgba(255,255,255,0) 100%);
          border-radius: 2px;
          animation: shoot-along linear infinite;
        }
      `}</style>

      {/* ── SHARED DARK WRAPPER (profile + game stats) ── */}
      <div style={{ position: 'relative', background: '#020408', overflow: 'hidden' }}>

        {/* Shooting stars — span full wrapper height */}
        {[
          { top: '5%',  left: '-8%',  delay: '0s',    dur: '2.8s', rot: 38 },
          { top: '15%', left: '-5%',  delay: '1.2s',  dur: '3.2s', rot: 35 },
          { top: '3%',  left: '30%',  delay: '0.5s',  dur: '2.5s', rot: 40 },
          { top: '28%', left: '-10%', delay: '2.1s',  dur: '3.6s', rot: 36 },
          { top: '40%', left: '10%',  delay: '0.9s',  dur: '2.9s', rot: 37 },
          { top: '10%', left: '55%',  delay: '1.8s',  dur: '3.0s', rot: 39 },
          { top: '52%', left: '-3%',  delay: '3.0s',  dur: '2.7s', rot: 35 },
          { top: '22%', left: '45%',  delay: '2.5s',  dur: '3.4s', rot: 38 },
          { top: '65%', left: '20%',  delay: '1.4s',  dur: '3.1s', rot: 37 },
          { top: '75%', left: '-5%',  delay: '0.7s',  dur: '2.6s', rot: 36 },
          { top: '82%', left: '60%',  delay: '2.9s',  dur: '3.3s', rot: 39 },
          { top: '90%', left: '35%',  delay: '1.6s',  dur: '2.9s', rot: 38 },
        ].map((s, i) => (
          <div
            key={i}
            className="star-track"
            style={{
              top: s.top,
              left: s.left,
              transform: `rotate(${s.rot}deg)`,
              transformOrigin: 'left center',
              position: 'absolute',
              zIndex: 0,
            }}
          >
            <div
              className="star-trail"
              style={{ animationDelay: s.delay, animationDuration: s.dur }}
            />
          </div>
        ))}

        {/* Mini background stars — span full wrapper height */}
        {[
          { top: '6%',  left: '8%',   size: 2, dur: '3s',   delay: '0s'   },
          { top: '18%', left: '22%',  size: 1, dur: '4s',   delay: '1s'   },
          { top: '35%', left: '5%',   size: 2, dur: '2.5s', delay: '0.5s' },
          { top: '50%', left: '18%',  size: 1, dur: '3.5s', delay: '2s'   },
          { top: '30%', left: '42%',  size: 2, dur: '4.2s', delay: '1.5s' },
          { top: '12%', left: '60%',  size: 1, dur: '3.1s', delay: '0.8s' },
          { top: '45%', left: '48%',  size: 2, dur: '2.8s', delay: '2.2s' },
          { top: '60%', left: '35%',  size: 1, dur: '3.8s', delay: '0.3s' },
          { top: '38%', left: '70%',  size: 2, dur: '3.3s', delay: '1.7s' },
          { top: '22%', left: '80%',  size: 1, dur: '4.5s', delay: '0.6s' },
          { top: '5%',  left: '88%',  size: 2, dur: '2.6s', delay: '1.1s' },
          { top: '42%', left: '92%',  size: 1, dur: '3.7s', delay: '2.8s' },
          { top: '28%', left: '15%',  size: 1, dur: '4.1s', delay: '0.4s' },
          { top: '15%', left: '75%',  size: 2, dur: '2.9s', delay: '3.1s' },
          { top: '55%', left: '62%',  size: 1, dur: '3.4s', delay: '1.4s' },
          { top: '70%', left: '8%',   size: 2, dur: '3.0s', delay: '0.9s' },
          { top: '78%', left: '50%',  size: 1, dur: '4.3s', delay: '1.8s' },
          { top: '85%', left: '28%',  size: 2, dur: '2.7s', delay: '2.5s' },
          { top: '92%', left: '72%',  size: 1, dur: '3.6s', delay: '0.2s' },
          { top: '68%', left: '85%',  size: 2, dur: '3.2s', delay: '3.3s' },
          { top: '3%',  left: '33%',  size: 1, dur: '3.9s', delay: '2.0s' },
          { top: '9%',  left: '46%',  size: 2, dur: '2.4s', delay: '0.7s' },
          { top: '17%', left: '3%',   size: 1, dur: '4.6s', delay: '1.3s' },
          { top: '24%', left: '56%',  size: 2, dur: '3.1s', delay: '2.7s' },
          { top: '33%', left: '90%',  size: 1, dur: '2.8s', delay: '0.1s' },
          { top: '48%', left: '30%',  size: 2, dur: '4.0s', delay: '1.6s' },
          { top: '57%', left: '78%',  size: 1, dur: '3.5s', delay: '3.0s' },
          { top: '63%', left: '40%',  size: 2, dur: '2.9s', delay: '0.5s' },
          { top: '73%', left: '66%',  size: 1, dur: '4.2s', delay: '2.3s' },
          { top: '80%', left: '10%',  size: 2, dur: '3.3s', delay: '1.0s' },
          { top: '87%', left: '44%',  size: 1, dur: '2.6s', delay: '3.6s' },
          { top: '94%', left: '20%',  size: 2, dur: '3.8s', delay: '0.8s' },
          { top: '96%', left: '58%',  size: 1, dur: '4.4s', delay: '1.5s' },
          { top: '2%',  left: '70%',  size: 2, dur: '3.0s', delay: '2.9s' },
          { top: '40%', left: '96%',  size: 1, dur: '2.5s', delay: '0.3s' },
          { top: '52%', left: '2%',   size: 2, dur: '4.1s', delay: '1.9s' },
        ].map((s, i) => (
          <div
            key={`dot-${i}`}
            className="star-dot"
            style={{
              top: s.top,
              left: s.left,
              width: s.size * 2,
              height: s.size * 2,
              animationDuration: s.dur,
              animationDelay: s.delay,
              position: 'absolute',
              zIndex: 0,
            }}
          />
        ))}

        {/* ── BLACK (profile card left, achievements right) ── */}
        <div style={{ minHeight: '115vh', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '5vh 6vw', gap: '4vw', position: 'relative' }}>
        <RocketPath />

        {/* Left — Profile Card + Download Resume */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.8rem' }}>
          <ProfileCard
            avatarUrl="/profile.png"
            name="Akhilesh Bhute"
            title="Computer Science · Manipal University Jaipur"
            handle="akhileshbhute"
            email="bhuteakhilesh@gmail.com"
            status="Open to Work"
            contactText="Contact"
            enableTilt
            behindGlowEnabled
            behindGlowColor="rgba(125, 190, 255, 0.5)"
          />
          <a
            href="/resume.pdf"
            download
            className="cursor-target"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.28em',
              textTransform: 'uppercase' as const,
              color: '#fff',
              border: '1.5px solid #fff',
              borderRadius: '6px',
              padding: '0.8rem 2.2rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'transparent',
              cursor: 'none',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = '#fff'
              el.style.color = '#000'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'transparent'
              el.style.color = '#fff'
            }}
          >
            ↓ Download Resume
          </a>
        </div>

        {/* Right — Achievements & Stats */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Heading */}
          <div style={{ marginBottom: '0.4rem' }}>
            <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.5rem', letterSpacing: '0.35em', color: '#555', textTransform: 'uppercase' as const, marginBottom: '0.4rem' }}>
              Portfolio Highlights
            </p>
            <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.9rem, 2.2vw, 1.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1, margin: 0 }}>
              ACHIEVEMENTS &amp; STATS
            </h3>
            <div style={{ width: '36px', height: '2px', background: '#f97316', marginTop: '0.7rem' }} />
          </div>

          {/* Education */}
          <div style={{ background: '#0d1117', border: '1px solid #1e2030', borderRadius: '14px', padding: '1.1rem 1.4rem' }}>
            <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.45rem', letterSpacing: '0.3em', color: '#facc15', textTransform: 'uppercase' as const, marginBottom: '0.6rem' }}>
              Education
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {[
                { school: 'Universal High School', board: 'ICSE · Class 10', score: '93.8%' },
                { school: 'Vidya Vijay', board: 'CBSE · Class 12', score: '86.8%' },
              ].map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111827', borderRadius: '8px', padding: '0.5rem 0.8rem' }}>
                  <div>
                    <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(0.65rem, 1.1vw, 0.8rem)', fontWeight: 600, color: '#fff', margin: 0 }}>{e.school}</p>
                    <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(0.55rem, 0.9vw, 0.68rem)', color: '#666', margin: '0.15rem 0 0' }}>{e.board}</p>
                  </div>
                  <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)', fontWeight: 700, color: '#facc15', margin: 0, flexShrink: 0 }}>{e.score}</p>
                </div>
              ))}
            </div>
          </div>

          {/* LeetCode Stats */}
          <div style={{ background: '#0d1117', border: '1px solid #1e2030', borderRadius: '14px', padding: '1.1rem 1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.45rem', letterSpacing: '0.3em', color: '#f97316', textTransform: 'uppercase' as const, marginBottom: '0.25rem' }}>
                Competitive Programming
              </p>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.65rem, 1.3vw, 0.9rem)', fontWeight: 700, color: '#fff', margin: 0 }}>
                LeetCode Stats
              </p>
              <a
                href="https://leetcode.com/u/AshTheSpy/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.45rem', letterSpacing: '0.2em', color: '#60a5fa', textDecoration: 'none', textTransform: 'uppercase' as const, display: 'inline-block', marginTop: '0.4rem', border: '1px solid #60a5fa', borderRadius: '4px', padding: '3px 8px' }}
              >
                View →
              </a>
            </div>
            {/* LeetCode stats widget */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#111827', borderRadius: '10px', padding: '10px 12px', flexShrink: 0 }}>
              <svg width="68" height="68" viewBox="0 0 70 70" style={{ flexShrink: 0 }}>
                <defs>
                  <linearGradient id="lc-arc-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00b8a3" />
                    <stop offset="55%" stopColor="#ffc01e" />
                    <stop offset="100%" stopColor="#ef4743" />
                  </linearGradient>
                </defs>
                {/* background track */}
                <circle cx="35" cy="35" r="28" fill="none" stroke="#2d3142" strokeWidth="5.5" />
                {/* solved arc — starts at ~8 o'clock, spans ~240° */}
                <circle cx="35" cy="35" r="28" fill="none" stroke="url(#lc-arc-grad)" strokeWidth="5.5"
                  strokeDasharray="117.3 175.9" strokeLinecap="round"
                  transform="rotate(150, 35, 35)"
                />
                {/* center: solved count */}
                <text x="35" y="31" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="sans-serif">157</text>
                <text x="35" y="40" textAnchor="middle" fill="#555" fontSize="5.5" fontFamily="sans-serif">/3864</text>
                <text x="35" y="49" textAnchor="middle" fill="#34d399" fontSize="5" fontFamily="sans-serif">✓ Solved</text>
                <text x="35" y="57" textAnchor="middle" fill="#666" fontSize="4.5" fontFamily="sans-serif">5 Attempting</text>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {[
                  { label: 'Easy', solved: 80, total: 930, color: '#00b8a3' },
                  { label: 'Med.', solved: 72, total: 2021, color: '#ffc01e' },
                  { label: 'Hard', solved: 5, total: 913, color: '#ef4743' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', background: '#0d1117', borderRadius: '5px', padding: '3px 7px', minWidth: '90px' }}>
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.42rem', color: s.color }}>{s.label}</span>
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.42rem', color: '#fff' }}>
                      {s.solved}<span style={{ color: '#444' }}>/{s.total}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dean's List */}
          <div style={{ background: '#0d1117', border: '1px solid #1e2030', borderRadius: '14px', padding: '1.1rem 1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.45rem', letterSpacing: '0.3em', color: '#a78bfa', textTransform: 'uppercase' as const, marginBottom: '0.25rem' }}>
                Academic Excellence
              </p>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.65rem, 1.3vw, 0.9rem)', fontWeight: 700, color: '#fff', margin: 0 }}>
                3× Dean's List
              </p>
              <a
                href="#"
                style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.45rem', letterSpacing: '0.2em', color: '#a78bfa', textDecoration: 'none', textTransform: 'uppercase' as const, display: 'inline-block', marginTop: '0.4rem', border: '1px solid #a78bfa', borderRadius: '4px', padding: '3px 8px' }}
              >
                View →
              </a>
            </div>
            <div style={{ width: '130px', height: '76px', background: '#111827', border: '1px dashed #2a2a3e', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.4rem', color: '#333', letterSpacing: '0.2em' }}>IMG</span>
            </div>
          </div>

          {/* CGPA + Deloitte */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#0d1117', border: '1px solid #1e2030', borderRadius: '14px', padding: '1.1rem 1.4rem' }}>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.45rem', letterSpacing: '0.3em', color: '#34d399', textTransform: 'uppercase' as const, marginBottom: '0.25rem' }}>
                Academic GPA
              </p>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.65rem, 1.3vw, 0.9rem)', fontWeight: 700, color: '#fff', margin: '0 0 0.3rem' }}>
                CGPA
              </p>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.4rem, 2.8vw, 2rem)', fontWeight: 900, color: '#34d399', lineHeight: 1, margin: 0 }}>
                9.1<span style={{ fontSize: '55%', color: '#4a7a6a' }}>/10</span>
              </p>
            </div>

            <div style={{ background: '#0d1117', border: '1px solid #1e2030', borderRadius: '14px', padding: '1.1rem 1.4rem' }}>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.45rem', letterSpacing: '0.3em', color: '#86E1F4', textTransform: 'uppercase' as const, marginBottom: '0.25rem' }}>
                Competition
              </p>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.65rem, 1.3vw, 0.9rem)', fontWeight: 700, color: '#fff', margin: '0 0 0.3rem' }}>
                Deloitte Ideathon
              </p>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.6rem, 1.1vw, 0.8rem)', fontWeight: 600, color: '#86E1F4', margin: 0 }}>
                Finalist
              </p>
            </div>
          </div>
        </div>
        </div>{/* end profile grid */}

        {/* ── HOBBIES & LIFESTYLE ── */}
        <div style={{ padding: '5rem 8vw 6rem', position: 'relative' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.55rem, 1vw, 0.7rem)', letterSpacing: '0.35em', color: '#555', textTransform: 'uppercase' as const, marginBottom: '0.6rem' }}>
            Beyond The Code
          </p>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.4rem, 3vw, 2.4rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, margin: '0 0 1rem' }}>
            GAME STATS
          </h2>
          <div style={{ width: '40px', height: '2px', background: '#00F5D4', marginBottom: '1.2rem' }} />
          <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(0.75rem, 1.1vw, 0.9rem)', color: '#888', lineHeight: 1.7, margin: '0 0 2rem' }}>
            I really enjoy playing competitive games and test my abilities. Here are some stats that I would like to share:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {([
              { icon: '♟', label: 'Chess', desc: 'Rapid Peak Rating — 1875 · FIDE Classical Rating — 1442', link: 'https://www.chess.com/member/swirlyboo' } as { icon: string; label: string; desc: string; link?: string },
              { icon: '⚔', label: 'Clash Royale', desc: 'Highest Rank — Ultimate Champion · 1800 ELO · Local Peak Rank — 305 (IND)', link: '__cr_modal__' },
              { icon: '🎯', label: 'Valorant', desc: 'Peak Rank — Immortal 2 · 180 ELO', link: 'https://tracker.gg/valorant/profile/riot/Myster1oQT%231613/overview?platform=pc&playlist=competitive&season=aef237a0-494d-3a14-a1c8-ec8de84e309c' },
            ] as { icon: string; label: string; desc: string; link?: string }[]).map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.4rem', background: '#0d1117', border: '1px solid #1e2030', borderRadius: '12px', padding: '1.1rem 1.6rem' }}>
                <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{h.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.7rem, 1.1vw, 0.85rem)', fontWeight: 700, color: '#00F5D4', margin: '0 0 0.25rem', letterSpacing: '0.1em' }}>{h.label}</p>
                  <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(0.75rem, 1.1vw, 0.9rem)', color: '#888', margin: 0, lineHeight: 1.6 }}>{h.desc}</p>
                </div>
                {h.link && h.link === '__cr_modal__' ? (
                  <button
                    onClick={() => setCrModalOpen(true)}
                    className="cursor-target"
                    style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', color: '#00F5D4', background: 'transparent', textTransform: 'uppercase' as const, border: '1.5px solid #00F5D4', borderRadius: '6px', padding: '0.55rem 1.2rem', flexShrink: 0, whiteSpace: 'nowrap' as const, cursor: 'none' }}
                  >
                    View →
                  </button>
                ) : h.link ? (
                  <a
                    href={h.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-target"
                    style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', color: '#00F5D4', textDecoration: 'none', textTransform: 'uppercase' as const, border: '1.5px solid #00F5D4', borderRadius: '6px', padding: '0.55rem 1.2rem', flexShrink: 0, whiteSpace: 'nowrap' as const, cursor: 'none' }}
                  >
                    View →
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>{/* ── end shared dark wrapper ── */}

      {/* Clash Royale image modal */}
      {crModalOpen && (
        <div
          onClick={() => setCrModalOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <img
            src="/clashroyale1.png"
            alt="Clash Royale stats"
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '12px', boxShadow: '0 0 60px rgba(0,245,212,0.2)' }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {/* ── TECHSTACK (circular gallery) ── */}
      <div style={{ width: '100%', height: '600px', background: '#020408', position: 'relative', overflow: 'hidden' }}>

        {/* Shooting comets */}
        {[
          { top: '8%',  left: '-8%',  delay: '0.3s',  dur: '2.8s', rot: 38 },
          { top: '20%', left: '15%',  delay: '1.5s',  dur: '3.1s', rot: 35 },
          { top: '5%',  left: '45%',  delay: '0.8s',  dur: '2.6s', rot: 40 },
          { top: '40%', left: '-5%',  delay: '2.4s',  dur: '3.4s', rot: 36 },
          { top: '55%', left: '30%',  delay: '1.0s',  dur: '3.0s', rot: 37 },
          { top: '70%', left: '60%',  delay: '2.0s',  dur: '2.9s', rot: 39 },
        ].map((s, i) => (
          <div key={i} className="star-track" style={{ top: s.top, left: s.left, transform: `rotate(${s.rot}deg)`, transformOrigin: 'left center', position: 'absolute', zIndex: 0 }}>
            <div className="star-trail" style={{ animationDelay: s.delay, animationDuration: s.dur }} />
          </div>
        ))}

        {/* Background star dots */}
        {[
          { top: '7%',  left: '10%',  size: 2, dur: '3.2s', delay: '0s'   },
          { top: '20%', left: '28%',  size: 1, dur: '4.0s', delay: '1.2s' },
          { top: '38%', left: '8%',   size: 2, dur: '2.8s', delay: '0.6s' },
          { top: '55%', left: '20%',  size: 1, dur: '3.6s', delay: '2.1s' },
          { top: '15%', left: '52%',  size: 2, dur: '4.3s', delay: '0.9s' },
          { top: '45%', left: '65%',  size: 1, dur: '3.0s', delay: '1.7s' },
          { top: '72%', left: '42%',  size: 2, dur: '2.5s', delay: '0.4s' },
          { top: '30%', left: '78%',  size: 1, dur: '3.8s', delay: '2.6s' },
          { top: '60%', left: '88%',  size: 2, dur: '3.5s', delay: '1.3s' },
          { top: '12%', left: '85%',  size: 1, dur: '4.1s', delay: '0.7s' },
          { top: '80%', left: '15%',  size: 2, dur: '3.3s', delay: '1.9s' },
          { top: '88%', left: '70%',  size: 1, dur: '2.7s', delay: '3.0s' },
          { top: '25%', left: '38%',  size: 2, dur: '4.5s', delay: '0.2s' },
          { top: '50%', left: '55%',  size: 1, dur: '3.1s', delay: '2.4s' },
          { top: '65%', left: '3%',   size: 2, dur: '3.9s', delay: '1.1s' },
        ].map((s, i) => (
          <div key={i} className="star-dot" style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDuration: s.dur, animationDelay: s.delay, zIndex: 0 }} />
        ))}

        <div style={{ position: 'absolute', top: '2rem', left: 0, right: 0, textAlign: 'center', zIndex: 10, pointerEvents: 'none' }}>
          <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.55rem, 1vw, 0.7rem)', letterSpacing: '0.35em', color: '#00F5D4', textTransform: 'uppercase', margin: 0 }}>
            My Techstack
          </p>
        </div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          <CircularGallery
            bend={3}
            textColor="#ffffff"
            borderRadius={0.05}
            items={[
              { image: '/cpp.png', text: 'C++' },
              { image: '/python.png', text: 'Python' },
              { image: '/github.png', text: 'GitHub' },
              { image: '/claude.png', text: 'Claude Code' },
              { image: '/tensorflow.png', text: 'TensorFlow' },
              { image: '/fastapi.png', text: 'FastAPI' },
              { image: '/react.png', text: 'React' },
              { image: '/pytorch.png', text: 'PyTorch' },
              { image: '/docker.png', text: 'Docker' },
              { image: '/huggingface.png', text: 'Hugging Face' },
            ]}
          />
        </div>
      </div>

      {/* ── EXPERIENCE ── */}
      <div
        id="experience"
        ref={expSectionRef}
        style={{ position: 'relative', background: '#fff' }}
      >
        {topBar}

        {/* Diagonal scroll velocity band — behind cards */}
        <div style={{
          position: 'absolute',
          top: '28%',
          left: '-20%',
          width: '160%',
          transform: 'rotate(-28deg)',
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          <ScrollVelocity
            texts={['REPETITION', 'CREATIVITY']}
            velocity={60}
            className=""
            parallaxStyle={{ overflow: 'hidden' }}
            scrollerStyle={{ color: '#00F5D4', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: 'Orbitron, sans-serif', fontWeight: 900, letterSpacing: '0.08em', opacity: 0.6, whiteSpace: 'nowrap' }}
          />
        </div>

        {/* Crossing diagonal — opposite angle, same card area */}
        <div style={{
          position: 'absolute',
          top: '28%',
          left: '-20%',
          width: '160%',
          transform: 'rotate(28deg)',
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          <ScrollVelocity
            texts={['INNOVATION', 'GRINDING MINDSET']}
            velocity={-60}
            className=""
            parallaxStyle={{ overflow: 'hidden' }}
            scrollerStyle={{ color: '#00F5D4', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: 'Orbitron, sans-serif', fontWeight: 900, letterSpacing: '0.08em', opacity: 0.6, whiteSpace: 'nowrap' }}
          />
        </div>

        {/* Diagonal scroll velocity band — third card area */}
        <div style={{
          position: 'absolute',
          top: '68%',
          left: '-20%',
          width: '160%',
          transform: 'rotate(-28deg)',
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          <ScrollVelocity
            texts={['REVISION', 'EXCELLENCE']}
            velocity={60}
            className=""
            parallaxStyle={{ overflow: 'hidden' }}
            scrollerStyle={{ color: '#00F5D4', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: 'Orbitron, sans-serif', fontWeight: 900, letterSpacing: '0.08em', opacity: 0.6, whiteSpace: 'nowrap' }}
          />
        </div>

        {/* Centered content */}
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '6rem 4vw 10rem', position: 'relative', zIndex: 1 }}>
        {/* Heading */}
        <div style={{ padding: '0 0 4rem', maxWidth: '900px' }}>
          <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.55rem, 1vw, 0.7rem)', letterSpacing: '0.35em', color: '#aaa', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            Mission Log
          </p>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, color: '#050505', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            EXPERIENCE
          </h2>
          <div style={{ width: '48px', height: '3px', background: '#050505', marginTop: '1rem' }} />
        </div>

        {/* Cards — vertical stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '900px' }}>
          {EXPERIENCE_CARDS.map((card, ci) => (
            <div
              key={ci}
              ref={el => { expCardRefs.current[ci] = el }}
              style={{
                background: '#050505',
                borderLeft: `4px solid ${card.accent}`,
                borderRadius: '6px',
                padding: '3.2rem 4rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>
                    {card.org}
                  </h3>
                  <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(0.8rem, 1.2vw, 1rem)', color: '#888', marginTop: '0.5rem', letterSpacing: '0.01em' }}>
                    {card.role}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(0.75rem, 1vw, 0.9rem)', letterSpacing: '0.04em', color: card.accent, fontWeight: 600, margin: 0 }}>
                    {card.period}
                  </p>
                  <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(0.7rem, 0.9vw, 0.82rem)', color: '#999', letterSpacing: '0.01em', marginTop: '0.3rem' }}>
                    {card.location}
                  </p>
                </div>
              </div>

              <div style={{ width: '100%', height: '1px', background: '#1e1e1e', margin: '2rem 0' }} />

              <ul style={{ margin: 0, padding: '0 0 0 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {card.bullets.map((b, bi) => (
                  <li key={bi} style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(0.82rem, 1.1vw, 1rem)', lineHeight: 1.8, color: '#bbb', letterSpacing: '0.01em' }}>
                    {b}
                  </li>
                ))}
              </ul>

              {'images' in card && (card as typeof card & { images?: { src: string; alt: string }[] }).images && (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                  {(card as typeof card & { images: { src: string; alt: string }[] }).images.map((img, ii) => (
                    <div key={ii} style={{ width: '180px', height: '110px', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${card.accent}33`, flexShrink: 0 }}>
                      <img
                        src={img.src}
                        alt={img.alt}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.parentElement as HTMLElement).style.background = '#111'; }}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginTop: '1.8rem' }}>
                <div style={{ width: '24px', height: '1.5px', background: card.accent }} />
                <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.5rem', letterSpacing: '0.3em', color: card.accent }}>
                  0{ci + 1} / 0{EXPERIENCE_CARDS.length}
                </span>
              </div>
            </div>
          ))}
        </div>
        </div>{/* end right column */}
      </div>

      {/* ── PROJECTS ── */}
      <div
        id="projects"
        style={{ position: 'relative', background: '#020408', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        {/* LightRays background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#00F5D4"
            raysSpeed={0.6}
            lightSpread={0.8}
            rayLength={1.8}
            pulsating={true}
            fadeDistance={1.2}
            saturation={0.7}
            followMouse={true}
            mouseInfluence={0.08}
          />
        </div>
        <div style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '8vh 8vw',
          width: '100%',
        }}>
          {/* heading */}
          <div style={{ marginBottom: '4rem' }}>
            <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.55rem, 1vw, 0.7rem)', letterSpacing: '0.35em', color: '#aaa', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Active Deployments
            </p>
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2.8rem, 7vw, 6.5rem)', fontWeight: 900, color: '#fff', lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0 }}>
              PROJECTS
            </h2>
            <div style={{ width: '48px', height: '3px', background: '#00F5D4', marginTop: '2rem' }} />
          </div>

          {/* cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              {
                title: 'COGNIANCHOR',
                sub: 'AI App for Alzheimer\'s Patients',
                context: 'Flutter · LangChain · FastAPI · Python — Deloitte Industry Capstone',
                bullets: [
                  'Built an AI-powered mobile app using Flutter to support Alzheimer\'s and dementia patients.',
                  'Implemented voice-based reminder placement and face detection using an offline database.',
                  'Developed robust backend with FastAPI; collaborated with Deloitte mentors in an agile team environment.',
                ],
                tech: ['Flutter', 'LangChain', 'FastAPI', 'Python'],
                accent: '#00F5D4',
                github: true,
                link: 'https://github.com/Ashthespycodes/cogni_anchor',
                image: '/cogni.png',
              },
              {
                title: 'ARCANE',
                sub: 'Agentic Replication of Cyberfraud and Adversarial Narrative Environments',
                context: 'Python · Mesa · Phaser.js · YAML · LLMs',
                bullets: [
                  'Built a multi-agent simulation framework using Mesa to study social engineering and cyber fraud behavior in sandboxed environments.',
                  'Designed deviant agents executing 5-phase social engineering attacks (urgency, authority, fear) and benign agents driven by Big Five personality traits via YAML personas.',
                  'Integrated LLM-powered agent reasoning (Gemini) with multi-channel communication (SMS, Email, Social DM) and a Phaser.js pixel-art dashboard for real-time monitoring.',
                ],
                tech: ['Python', 'Mesa', 'Phaser.js', 'YAML', 'Gemini'],
                accent: '#C4B5FD',
                github: true,
                link: 'https://github.com/Ashthespycodes/ARCANE',
                image: '/arcane.png',
              },
            ].map((proj, i) => (
              <div
                key={i}
                className="cursor-target"
                onClick={() => {
                  const p = proj as { link?: string };
                  if (p.link) window.open(p.link, '_blank', 'noopener,noreferrer');
                }}
                style={{
                  background: '#050505',
                  border: `1px solid ${proj.accent}33`,
                  borderLeft: `3px solid ${proj.accent}`,
                  borderRadius: '4px',
                  padding: '2rem 2.2rem',
                  cursor: 'none',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                  <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.45rem, 0.8vw, 0.58rem)', letterSpacing: '0.35em', color: proj.accent, textTransform: 'uppercase', margin: 0 }}>
                    {String(i + 1).padStart(2, '0')} / 02
                  </p>
                  {proj.github && (
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.4rem, 0.7vw, 0.52rem)', letterSpacing: '0.2em', color: proj.accent, border: `1px solid ${proj.accent}44`, borderRadius: '3px', padding: '0.2rem 0.5rem' }}>
                      GitHub
                    </span>
                  )}
                </div>
                <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.9rem, 1.6vw, 1.2rem)', fontWeight: 900, color: '#fff', margin: '0 0 0.3rem', letterSpacing: '-0.01em' }}>
                  {proj.title}
                </h3>
                <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.5rem, 0.9vw, 0.65rem)', letterSpacing: '0.08em', color: proj.accent, margin: '0 0 0.4rem' }}>
                  {proj.sub}
                </p>
                <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.42rem, 0.7vw, 0.55rem)', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', margin: '0 0 1rem', fontStyle: 'italic' }}>
                  {proj.context}
                </p>
                <ul style={{ margin: '0 0 1.2rem', padding: '0 0 0 1rem' }}>
                  {proj.bullets.map((b, bi) => (
                    <li key={bi} style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.5rem, 0.88vw, 0.68rem)', lineHeight: 1.9, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.03em', marginBottom: '0.4rem' }}>
                      {b}
                    </li>
                  ))}
                </ul>
                {'image' in proj && proj.image && (
                  <img
                    src={proj.image as string}
                    alt={`${proj.title} screenshot`}
                    style={{ width: '100%', borderRadius: '6px', marginBottom: '1.2rem', border: `1px solid ${proj.accent}33`, display: 'block' }}
                  />
                )}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {proj.tech.map(t => (
                    <span key={t} style={{
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: 'clamp(0.4rem, 0.7vw, 0.52rem)',
                      letterSpacing: '0.12em',
                      color: proj.accent,
                      border: `1px solid ${proj.accent}44`,
                      borderRadius: '3px',
                      padding: '0.25rem 0.55rem',
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BLOG ── */}
      <BlogSection />

      {/* ── LASER FLOW ── */}
      <div style={{ width: '100%', height: '760px', background: '#020408', position: 'relative', display: 'flex', alignItems: 'center' }}>
        {/* Blurred background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/codebg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(12px) brightness(0.3)',
          transform: 'scale(1.05)',
          zIndex: 0,
        }} />
        <LaserFlow wispDensity={1.2} flowSpeed={0.6} verticalBeamOffset={-0.45} />
        {/* Random fact — left side */}
        <div style={{ position: 'absolute', left: '15vw', top: '50%', transform: 'translateY(-50%)', maxWidth: '280px', zIndex: 10, pointerEvents: 'none' }}>
          <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.65rem, 1.1vw, 0.85rem)', letterSpacing: '0.35em', color: '#00F5D4', textTransform: 'uppercase', marginBottom: '0.8rem', opacity: 0.7 }}>
            Random Fact
          </p>
          <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 2, letterSpacing: '0.04em' }}>
            I started playing chess when I was 7 years old and have been fascinated by its artistic beauty ever since.
          </p>
        </div>
      </div>

      {/* ── INFORMATION ── */}
      <div
        id="information"
        style={{ position: 'relative', background: '#050505', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#00F5D4' }} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 8vw', maxWidth: '1200px', margin: '0 auto', width: '100%', textAlign: 'center' as const }}>
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2.8rem, 7vw, 6.5rem)', fontWeight: 900, color: '#fff', lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
              <span style={{ display: 'block' }}>INFORMATION</span>
            </h2>
            <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.55rem, 1vw, 0.7rem)', letterSpacing: '0.35em', color: '#00F5D4', textTransform: 'uppercase' }}>
              Lets create something beautiful together :)
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.8rem', flexWrap: 'wrap' as const, justifyContent: 'center' }}>
            {[
              {
                label: 'Instagram',
                href: '#',
                svg: (
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                ),
                color: '#E1306C',
              },
              {
                label: 'GitHub',
                href: '#',
                svg: (
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                ),
                color: '#fff',
              },
              {
                label: 'LeetCode',
                href: 'https://leetcode.com/u/AshTheSpy/',
                svg: (
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H19.7a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                  </svg>
                ),
                color: '#FFA116',
              },
              {
                label: 'LinkedIn',
                href: '#',
                svg: (
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                ),
                color: '#0A66C2',
              },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-target"
                title={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  border: '1.5px solid #222',
                  background: '#0d1117',
                  color: item.color,
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  cursor: 'none',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = item.color
                  ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 16px ${item.color}55`
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#222'
                  ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'
                }}
              >
                {item.svg}
              </a>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.5rem 8vw', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.55rem', letterSpacing: '0.25em', color: '#444' }}>
            MYSTIC OASIS · STAR SYSTEM
          </span>
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.55rem', letterSpacing: '0.25em', color: '#444' }}>
            © {new Date().getFullYear()} · ALL RIGHTS RESERVED
          </span>
        </div>
      </div>
    </>
  )
}
