import { cn } from '@/lib/utils'
import React from 'react'
import { Icon } from '../ui/icon'

interface ImageProps extends React.ComponentProps<'img'> {
  fallbackSize?: number // width & height in px
}

const FallbackIcon: React.FC<React.ComponentProps<'div'>> = ({ className, title, ...props }) => (
  <div
    role="img"
    aria-label="Image not available"
    title={title}
    className={cn('bg-muted/80 text-muted-foreground place-content-center place-items-center', className)}
    {...props}
  >
    <Icon name="Image" size={28} strokeWidth={1.5} />
  </div>
)

const Image: React.FC<ImageProps> = ({ ref, src, alt = '', className, loading = 'lazy', ...props }) => {
  if (!src) {
    return <FallbackIcon {...{ className, title: alt, ...props }} />
  }

  return <img ref={ref} src={src} alt={alt} loading={loading} className={cn('object-cover', className)} {...props} />
}

export default Image
