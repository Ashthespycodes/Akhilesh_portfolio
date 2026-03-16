declare module './ScrollVelocity' {
  import { RefObject } from 'react'
  interface ScrollVelocityProps {
    texts?: string[]
    velocity?: number
    className?: string
    damping?: number
    stiffness?: number
    numCopies?: number
    velocityMapping?: { input: [number, number]; output: [number, number] }
    parallaxClassName?: string
    scrollerClassName?: string
    parallaxStyle?: React.CSSProperties
    scrollerStyle?: React.CSSProperties
    scrollContainerRef?: RefObject<HTMLElement>
  }
  export const ScrollVelocity: React.FC<ScrollVelocityProps>
  export default ScrollVelocity
}
