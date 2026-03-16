import React from 'react'

interface LED {
  color: 'green' | 'amber' | 'red'
  delay: string
}

const LEFT_LEDS: LED[] = [
  { color: 'green', delay: '0s' },
  { color: 'green', delay: '0.3s' },
  { color: 'amber', delay: '0.7s' },
  { color: 'amber', delay: '1.1s' },
  { color: 'green', delay: '0.5s' },
  { color: 'red', delay: '2s' },
]

const RIGHT_LEDS: LED[] = [
  { color: 'amber', delay: '0.2s' },
  { color: 'green', delay: '0.6s' },
  { color: 'green', delay: '1.0s' },
  { color: 'red', delay: '1.8s' },
  { color: 'amber', delay: '0.4s' },
  { color: 'green', delay: '0.9s' },
]

const LED_COLORS = {
  green: '#00ff41',
  amber: '#FFB347',
  red: '#ff2222',
}

function LEDLight({ color, delay }: LED) {
  return (
    <div style={{
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: LED_COLORS[color],
      boxShadow: `0 0 6px 2px ${LED_COLORS[color]}`,
      border: `1px solid ${LED_COLORS[color]}`,
      animationDelay: delay,
    }} className={`led-${color}`} />
  )
}

function RivetRow({ count = 4, vertical = false }: { count?: number, vertical?: boolean }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: vertical ? 'column' : 'row',
      gap: vertical ? '18px' : '12px',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #888, #2a2a2a)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.15)',
          border: '1px solid #444',
        }} />
      ))}
    </div>
  )
}

function FakeReadout({ label, value, unit }: { label: string, value: string, unit?: string }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.7)',
      border: '1px solid rgba(0,245,212,0.2)',
      borderRadius: '2px',
      padding: '4px 6px',
      marginBottom: '4px',
    }}>
      <div style={{
        color: 'rgba(0,245,212,0.5)',
        fontSize: '0.45rem',
        letterSpacing: '0.2em',
        fontFamily: 'Space Mono, monospace',
        textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{
        color: '#00F5D4',
        fontSize: '0.65rem',
        fontFamily: 'Space Mono, monospace',
        fontWeight: 700,
      }}>{value}{unit && <span style={{ opacity: 0.6, fontSize: '0.5rem', marginLeft: '2px' }}>{unit}</span>}</div>
    </div>
  )
}

function SidePanel({ side, leds }: { side: 'left' | 'right', leds: LED[] }) {
  const isLeft = side === 'left'

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    [isLeft ? 'left' : 'right']: 0,
    width: 'clamp(60px, 8vw, 100px)',
    background: `linear-gradient(${isLeft ? '90deg' : '270deg'},
      #0a0a14 0%,
      #111122 20%,
      #141428 40%,
      #0d0d1e 60%,
      #111122 80%,
      #0a0a14 100%
    )`,
    borderRight: isLeft ? '2px solid #1e1e3a' : 'none',
    borderLeft: isLeft ? 'none' : '2px solid #1e1e3a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 8px',
    zIndex: 100,
    boxShadow: isLeft
      ? 'inset -4px 0 12px rgba(0,0,0,0.8), 4px 0 20px rgba(0,0,0,0.5)'
      : 'inset 4px 0 12px rgba(0,0,0,0.8), -4px 0 20px rgba(0,0,0,0.5)',
    overflow: 'hidden',
  }

  // Panel seam lines
  const seamStyle: React.CSSProperties = {
    position: 'absolute',
    top: '15%',
    bottom: '15%',
    width: '1px',
    background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)',
    [isLeft ? 'right' : 'left']: '35%',
  }

  return (
    <div style={panelStyle}>
      {/* Seam */}
      <div style={seamStyle} />

      {/* Top area - instrument block */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        width: '100%',
        marginTop: '8px',
      }}>
        {/* Yellow instrument card */}
        <div style={{
          background: 'linear-gradient(135deg, #2a2000, #1a1400)',
          border: '1px solid rgba(255,179,71,0.4)',
          borderRadius: '3px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 8px rgba(255,179,71,0.1)',
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            background: 'linear-gradient(135deg, #FFB347, #cc8800)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            opacity: 0.8,
          }} />
        </div>

        {/* Diamond indicator */}
        <div style={{
          background: 'linear-gradient(135deg, #001a2a, #001520)',
          border: '1px solid rgba(0,245,212,0.3)',
          borderRadius: '3px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '14px',
            height: '14px',
            background: 'linear-gradient(135deg, #00F5D4, #008866)',
            transform: 'rotate(45deg)',
            opacity: 0.9,
          }} />
        </div>

        {/* Blue rect */}
        <div style={{
          background: '#0a1a3a',
          border: '1px solid rgba(100,160,255,0.4)',
          borderRadius: '2px',
          height: '24px',
          margin: '0 4px',
        }} />

        {/* Green oval */}
        <div style={{
          background: '#0a2a0a',
          border: '1px solid rgba(0,200,80,0.4)',
          borderRadius: '12px',
          height: '28px',
          margin: '0 6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#00cc44',
            boxShadow: '0 0 6px #00cc44',
            animation: 'blink-green 2s ease-in-out infinite',
          }} />
        </div>
      </div>

      {/* Middle - LEDs */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
      }}>
        <RivetRow count={2} vertical />
        {leds.map((led, i) => (
          <LEDLight key={i} {...led} />
        ))}
        <RivetRow count={2} vertical />
      </div>

      {/* Bottom - fake readouts */}
      <div style={{ width: '100%' }}>
        {isLeft ? (
          <>
            <FakeReadout label="SYS" value="ONLINE" />
            <FakeReadout label="PWR" value="98.2" unit="%" />
          </>
        ) : (
          <>
            <FakeReadout label="SHD" value="ACTIVE" />
            <FakeReadout label="HLT" value="100" unit="%" />
          </>
        )}
        <RivetRow count={3} />
      </div>
    </div>
  )
}

function TopBar() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 'clamp(60px, 8vw, 100px)',
      right: 'clamp(60px, 8vw, 100px)',
      height: '3px',
      background: 'linear-gradient(90deg, transparent, rgba(0,245,212,0.2) 20%, rgba(200,230,255,0.15) 50%, rgba(0,245,212,0.2) 80%, transparent)',
      zIndex: 100,
      boxShadow: '0 1px 8px rgba(0,245,212,0.1)',
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '0',
        right: '0',
        height: '1px',
        background: 'rgba(0,245,212,0.3)',
      }} />
    </div>
  )
}

function BottomBar() {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 'clamp(60px, 8vw, 100px)',
      right: 'clamp(60px, 8vw, 100px)',
      height: '3px',
      background: 'linear-gradient(90deg, transparent, rgba(0,245,212,0.15) 30%, rgba(0,245,212,0.15) 70%, transparent)',
      zIndex: 100,
    }} />
  )
}

export function SpaceshipFrame() {
  return (
    <>
      <SidePanel side="left" leds={LEFT_LEDS} />
      <SidePanel side="right" leds={RIGHT_LEDS} />
      <TopBar />
      <BottomBar />
    </>
  )
}
