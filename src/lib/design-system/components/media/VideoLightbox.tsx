'use client'

import React, { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '../shared-utils'

export interface VideoLightboxProps {
  /** YouTube video ID */
  videoId: string
  /** Video title for accessibility */
  title?: string
  /** Whether the lightbox is visible */
  isOpen: boolean
  /** Close handler */
  onClose: () => void
  /** Optional notes to display below the video */
  notes?: string[]
  /** Optional image to display below the video */
  image?: string
  className?: string
}

/**
 * VideoLightbox - Full-screen modal for playing a YouTube video.
 *
 * Closes on ESC key or backdrop click.  Optionally renders notes and
 * a reference image beneath the video (e.g., Adhesive Back Marine Snaps
 * tips, Notching Stucco Strip photo).
 */
export function VideoLightbox({
  videoId,
  title,
  isOpen,
  onClose,
  notes,
  image,
  className,
}: VideoLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-4 md:p-8',
        className
      )}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        aria-label="Close video"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Video */}
      <div
        className="relative w-full max-w-5xl aspect-video flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title || 'YouTube video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full rounded-xl"
        />
      </div>

      {/* Title */}
      {title && (
        <p className="text-white font-semibold text-lg mt-4 text-center">{title}</p>
      )}

      {/* Notes & Image (scrollable if tall) */}
      {(notes?.length || image) && (
        <div
          className="mt-4 max-w-5xl w-full max-h-48 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {notes && notes.length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <ul className="space-y-1.5">
                {notes.map((note, idx) => (
                  <li key={idx} className="text-white/80 text-sm flex gap-2">
                    <span className="text-white/50 shrink-0">&bull;</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {image && (
            <div className="mt-3 flex justify-center">
              <img
                src={image}
                alt={title || 'Reference image'}
                className="rounded-xl max-h-40 object-contain"
                loading="lazy"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
