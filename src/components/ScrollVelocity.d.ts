import { RefObject, CSSProperties, FC } from 'react'

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
  parallaxStyle?: CSSProperties
  scrollerStyle?: CSSProperties
  scrollContainerRef?: RefObject<HTMLElement>
}

export declare const ScrollVelocity: FC<ScrollVelocityProps>
export default ScrollVelocity
