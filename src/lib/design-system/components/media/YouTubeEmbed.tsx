'use client'

import React, { useState } from 'react'
import { Play } from 'lucide-react'
import { cn } from '../shared-utils'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  duration?: string
  variant?: 'default' | 'hero' | 'card'
  className?: string
  // Lazy load - show thumbnail first, load iframe on click
  lazy?: boolean
  // Custom thumbnail URL (optional)
  thumbnailUrl?: string
  // Tracking
  trackingId?: string
  onPlay?: () => void
}

export const YouTubeEmbed = React.forwardRef<HTMLDivElement, YouTubeEmbedProps>(
  ({ 
    videoId,
    title,
    duration,
    variant = 'default',
    className = '',
    lazy = true,
    thumbnailUrl: customThumbnail,
    trackingId,
    onPlay,
  }, ref) => {
    const [isLoaded, setIsLoaded] = useState(!lazy)
    const [thumbnailError, setThumbnailError] = useState(false)

    const variants = {
      default: 'rounded-xl border-2 border-gray-200',
      hero: 'rounded-3xl border-2 border-[#406517] shadow-lg',
      card: 'rounded-2xl border border-gray-200'
    }

    // Use custom thumbnail, or fallback chain: maxresdefault -> hqdefault
    const thumbnailUrl = customThumbnail 
      || (thumbnailError 
          ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
          : `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`)
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`

    const handlePlay = () => {
      setIsLoaded(true)
      onPlay?.()
    }

    const handleThumbnailError = () => {
      if (!thumbnailError) {
        setThumbnailError(true)
      }
    }

    return (
      <div 
        ref={ref}
        className={cn(
          'relative overflow-hidden bg-black aspect-video',
          variants[variant],
          className
        )}
      >
        {isLoaded ? (
          <iframe
            src={embedUrl}
            title={title || 'YouTube video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={handlePlay}
            className="absolute inset-0 w-full h-full group cursor-pointer"
            aria-label={`Play ${title || 'video'}`}
          >
            {/* Thumbnail */}
            <img
              src={thumbnailUrl}
              alt={title || 'Video thumbnail'}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onError={handleThumbnailError}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#406517] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Duration Badge */}
            {duration && (
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded">
                {duration}
              </div>
            )}

            {/* Title */}
            {title && (
              <div className="absolute bottom-3 left-3 right-16 text-white text-sm font-medium truncate">
                {title}
              </div>
            )}
          </button>
        )}
      </div>
    )
  }
)
YouTubeEmbed.displayName = 'YouTubeEmbed'
