import { FC } from 'react'

export interface ProfileCardProps {
  avatarUrl?: string
  iconUrl?: string
  grainUrl?: string
  innerGradient?: string
  behindGlowEnabled?: boolean
  behindGlowColor?: string
  behindGlowSize?: string
  className?: string
  enableTilt?: boolean
  enableMobileTilt?: boolean
  mobileTiltSensitivity?: number
  miniAvatarUrl?: string
  name?: string
  title?: string
  email?: string
  handle?: string
  status?: string
  contactText?: string
  showUserInfo?: boolean
  onContactClick?: () => void
}

declare const ProfileCard: FC<ProfileCardProps>
export default ProfileCard
