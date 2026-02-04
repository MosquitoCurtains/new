'use client'

import React from 'react'
import { cn } from '../shared-utils'

interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string
  poster?: string
  variant?: 'default' | 'hero' | 'card'
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  className?: string
  // Performance optimization
  preload?: 'none' | 'metadata' | 'auto'
  quality?: 'auto' | 'high' | 'medium' | 'low'
  // Engagement tracking props
  onMilestoneReached?: (milestone: 25 | 50 | 75 | 95, currentTime: number) => void
  onLeadCapture?: (data: { name: string; email: string }) => void
  showLeadCaptureAt?: 25 | 50 | 75 | 95
  trackingId?: string
  saveProgress?: boolean
  // Analytics
  onPlay?: () => void
  onPause?: () => void
  onComplete?: () => void
}

export const Video = React.forwardRef<HTMLVideoElement, VideoProps>(
  ({ 
    src, 
    poster, 
    variant = 'default', 
    autoplay = false, 
    muted = false, 
    loop = false, 
    controls = true,
    className = '',
    preload = 'metadata',
    quality = 'auto',
    onMilestoneReached,
    onLeadCapture,
    showLeadCaptureAt,
    trackingId,
    saveProgress = true,
    onPlay,
    onPause,
    onComplete,
    ...props 
  }, ref) => {
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const [currentTime, setCurrentTime] = React.useState(0)
    const [duration, setDuration] = React.useState(0)
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [milestonesReached, setMilestonesReached] = React.useState<Set<number>>(new Set())
    const [showLeadForm, setShowLeadForm] = React.useState(false)
    const [leadFormData, setLeadFormData] = React.useState({ name: '', email: '' })

    const variants = {
      default: 'rounded-xl border-2 border-gray-200',
      hero: 'rounded-3xl border-2 border-[#406517] shadow-lg',
      card: 'rounded-2xl border border-gray-200'
    }

    // Combine refs
    React.useImperativeHandle(ref, () => videoRef.current!)

    // Load saved progress
    React.useEffect(() => {
      if (saveProgress && trackingId) {
        const savedTime = localStorage.getItem(`video-progress-${trackingId}`)
        if (savedTime && videoRef.current) {
          videoRef.current.currentTime = parseFloat(savedTime)
        }
      }
    }, [trackingId, saveProgress])

    // Track progress and milestones
    const handleTimeUpdate = () => {
      if (!videoRef.current) return
      
      const time = videoRef.current.currentTime
      const total = videoRef.current.duration
      
      setCurrentTime(time)
      setDuration(total)

      // Save progress to localStorage
      if (saveProgress && trackingId) {
        localStorage.setItem(`video-progress-${trackingId}`, time.toString())
      }

      // Check milestones
      if (total > 0) {
        const percentage = (time / total) * 100
        const milestones = [25, 50, 75, 95]
        
        milestones.forEach(milestone => {
          if (percentage >= milestone && !milestonesReached.has(milestone)) {
            setMilestonesReached(prev => new Set([...prev, milestone]))
            onMilestoneReached?.(milestone as 25 | 50 | 75 | 95, time)
            
            // Show lead capture form if specified
            if (showLeadCaptureAt === milestone) {
              setShowLeadForm(true)
            }
          }
        })
      }
    }

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration)
      }
    }

    const handlePlay = () => {
      setIsPlaying(true)
      onPlay?.()
    }

    const handlePause = () => {
      setIsPlaying(false)
      onPause?.()
    }

    const handleEnded = () => {
      onComplete?.()
    }

    // Use the provided src directly - quality selection handled by the URL
    const getOptimizedSrc = () => {
      return src
    }

    const handleLeadSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onLeadCapture?.(leadFormData)
      setShowLeadForm(false)
      setLeadFormData({ name: '', email: '' })
    }

    const handlePlayButtonClick = () => {
      if (videoRef.current) {
        videoRef.current.play()
      }
    }


    return (
      <div className={cn('relative overflow-hidden', variants[variant], className)}>
        <video
          ref={videoRef}
          src={getOptimizedSrc()}
          poster={poster}
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          controls={controls}
          preload={preload}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          className="w-full h-auto"
          style={{
            aspectRatio: '16/9'
          }}
          {...props}
        />
        
        {!controls && !isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
            onClick={handlePlayButtonClick}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#406517] flex items-center justify-center shadow-lg">
              <div className="w-0 h-0 border-l-[16px] border-l-white border-y-[10px] border-y-transparent ml-1"></div>
            </div>
          </div>
        )}

        {/* Lead Capture Form Overlay */}
        {showLeadForm && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white border-2 border-[#406517] rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Get More Information
              </h3>
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={leadFormData.name}
                  onChange={(e) => setLeadFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={leadFormData.email}
                  onChange={(e) => setLeadFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#406517] focus:border-transparent"
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#406517] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#365512] transition-colors"
                  >
                    Continue Watching
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLeadForm(false)}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Progress Indicator - Only show when controls are disabled */}
        {!controls && duration > 0 && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/50 rounded-full h-1">
            <div 
              className="bg-[#406517] h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        )}
      </div>
    )
  }
)
Video.displayName = 'Video'

