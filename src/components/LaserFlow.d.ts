import { FC } from 'react'

interface LaserFlowProps {
  wispDensity?: number
  tiltScale?: number
  flowSpeed?: number
  horizontalBeamOffset?: number
  verticalBeamOffset?: number
  verticalSizing?: number
  horizontalSizing?: number
  fogIntensity?: number
  flowStrength?: number
  decay?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}

declare const LaserFlow: FC<LaserFlowProps>
export default LaserFlow
