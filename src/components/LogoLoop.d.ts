import { CSSProperties, FC, ReactNode } from 'react'

export interface LogoItem {
  src?: string
  srcSet?: string
  sizes?: string
  width?: number | string
  height?: number | string
  alt?: string
  title?: string
  href?: string
  ariaLabel?: string
  node?: ReactNode
}

export interface LogoLoopProps {
  logos: LogoItem[]
  speed?: number
  direction?: 'left' | 'right' | 'up' | 'down'
  width?: number | string
  logoHeight?: number | string
  gap?: number
  pauseOnHover?: boolean
  hoverSpeed?: number
  fadeOut?: boolean
  fadeOutColor?: string
  scaleOnHover?: boolean
  renderItem?: (item: LogoItem, key: string) => ReactNode
  ariaLabel?: string
  className?: string
  style?: CSSProperties
}

export declare const LogoLoop: FC<LogoLoopProps>
export default LogoLoop
