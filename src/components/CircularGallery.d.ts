import { FC } from 'react'

interface GalleryItem {
  image: string
  text: string
}

interface CircularGalleryProps {
  items?: GalleryItem[]
  bend?: number
  textColor?: string
  borderRadius?: number
  font?: string
  scrollSpeed?: number
  scrollEase?: number
}

declare const CircularGallery: FC<CircularGalleryProps>
export default CircularGallery
