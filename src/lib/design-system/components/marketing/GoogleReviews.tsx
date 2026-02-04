'use client'

import { useState, useEffect, useCallback } from 'react'
import { ReactGoogleReviews, ReactGoogleReview } from 'react-google-reviews'
import 'react-google-reviews/dist/index.css'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

export interface GoogleReviewsProps {
  /**
   * Featurable widget ID (recommended method)
   * Get one free at https://featurable.com
   */
  featurableId?: string
  /**
   * Autoplay speed in milliseconds (higher = slower)
   */
  carouselSpeed?: number
  /**
   * Minimum star rating to show (default: 5)
   */
  minRating?: number
  /**
   * Maximum number of reviews to display (default: 9)
   */
  maxReviews?: number
  /**
   * Brand accent color (default: #406517 - Mosquito Curtains green)
   */
  accentColor?: string
}

// Format relative dates
function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

// Character limit for truncation
const CHAR_LIMIT = 150

// Custom Review Card - Styled to match site design
function ReviewCard({ review, accentColor }: { review: ReactGoogleReview; accentColor: string }) {
  const [imageError, setImageError] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const rating = (review as any).starRating ?? (review as any).rating ?? 5
  const photoUrl = (review.reviewer as any).profilePhotoUrl ?? (review.reviewer as any).profilePhoto
  const comment = review.comment || ''
  const isLong = comment.length > CHAR_LIMIT
  
  // Initials fallback component
  const InitialsAvatar = () => (
    <div 
      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
      style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
    >
      {review.reviewer.displayName.charAt(0).toUpperCase()}
    </div>
  )
  
  return (
    <div 
      className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
      style={{ ['--accent-color' as any]: accentColor }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {photoUrl && !imageError ? (
          <img 
            src={photoUrl} 
            alt={review.reviewer.displayName}
            className="w-12 h-12 rounded-full object-cover border-2"
            style={{ borderColor: `${accentColor}30` }}
            onError={() => setImageError(true)}
          />
        ) : (
          <InitialsAvatar />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {review.reviewer.displayName}
          </p>
          <p className="text-xs text-gray-500">
            {review.createTime ? formatRelativeDate(review.createTime) : 'Google Review'}
          </p>
        </div>
        {/* Google icon */}
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      </div>
      
      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'text-[#FFA501] fill-[#FFA501]' : 'text-gray-200 fill-gray-200'}`} 
          />
        ))}
      </div>
      
      {/* Review text with Read more/less */}
      <div className="flex-1">
        <p className="text-gray-600 text-sm leading-relaxed">
          {comment ? (
            <>
              &ldquo;{expanded || !isLong ? comment : `${comment.slice(0, CHAR_LIMIT)}...`}&rdquo;
            </>
          ) : ''}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-medium mt-2 hover:underline"
            style={{ color: accentColor }}
          >
            {expanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  )
}

// Custom Carousel with equal-height cards
function ReviewCarousel({ 
  reviews, 
  speed = 8000,
  accentColor
}: { 
  reviews: ReactGoogleReview[]
  speed: number
  accentColor: string
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [visibleCount, setVisibleCount] = useState(3)
  
  useEffect(() => {
    const getVisibleCount = () => {
      if (typeof window === 'undefined') return 3
      if (window.innerWidth < 640) return 1
      if (window.innerWidth < 1024) return 2
      return 3
    }
    
    const handleResize = () => setVisibleCount(getVisibleCount())
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const maxIndex = Math.max(0, reviews.length - visibleCount)
  
  const goToNext = useCallback(() => {
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1)
  }, [maxIndex])
  
  const goToPrev = () => {
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1)
  }
  
  // Autoplay
  useEffect(() => {
    if (!isAutoPlaying || reviews.length <= visibleCount) return
    const interval = setInterval(goToNext, speed)
    return () => clearInterval(interval)
  }, [isAutoPlaying, speed, goToNext, reviews.length, visibleCount])
  
  if (reviews.length === 0) {
    return <p className="text-center text-gray-500">Loading reviews...</p>
  }
  
  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Carousel Container */}
      <div className="overflow-hidden mx-8">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
        >
          {reviews.map((review) => (
            <div 
              key={review.reviewId}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / visibleCount}%` }}
            >
              <ReviewCard review={review} accentColor={accentColor} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Arrows - always visible */}
      {reviews.length > visibleCount && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:shadow-lg transition-all"
            style={{ ['--hover-color' as any]: accentColor }}
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:shadow-lg transition-all"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  )
}

/**
 * Google Reviews Carousel Component
 * 
 * A beautiful, responsive Google reviews carousel that integrates with Featurable API.
 * 
 * Features:
 * - Equal height cards with consistent styling
 * - Filters by star rating (default: 5-star only)
 * - Smooth carousel with pause on hover
 * - "Read more/less" for long reviews
 * - Responsive: 1 card mobile, 2 tablet, 3 desktop
 * - Customizable accent color
 * 
 * @example
 * ```tsx
 * <GoogleReviews 
 *   featurableId={process.env.NEXT_PUBLIC_FEATURABLE_WIDGET_ID}
 *   minRating={5}
 *   maxReviews={9}
 *   carouselSpeed={8000}
 * />
 * ```
 */
export function GoogleReviews({
  featurableId,
  carouselSpeed = 8000,
  minRating = 5,
  maxReviews = 9,
  accentColor = '#406517',
}: GoogleReviewsProps) {
  if (!featurableId) {
    return (
      <div className="text-center py-8 px-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
        <p className="text-gray-600 mb-2">Google Reviews will appear here</p>
        <p className="text-sm text-gray-500">
          To enable: Get a free Featurable widget ID at{' '}
          <a 
            href="https://featurable.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:no-underline"
            style={{ color: accentColor }}
          >
            featurable.com
          </a>
        </p>
      </div>
    )
  }

  const customRenderer = (reviews: ReactGoogleReview[]) => {
    // Filter by minimum rating and limit to maxReviews
    const filteredReviews = reviews
      .filter(review => {
        const rating = (review as any).starRating ?? (review as any).rating ?? 5
        return rating >= minRating
      })
      .slice(0, maxReviews)
    
    // Calculate average rating from all reviews (not just filtered)
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + ((r as any).starRating ?? (r as any).rating ?? 5), 0) / reviews.length
      : 4.9
    
    return (
      <div className="space-y-6">
        {/* Rating Summary */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            {/* Stars */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => {
                const filled = i < Math.floor(avgRating)
                const partial = i === Math.floor(avgRating) && avgRating % 1 > 0
                return (
                  <Star 
                    key={i} 
                    className={`w-6 h-6 ${filled || partial ? 'text-[#FFA501] fill-[#FFA501]' : 'text-gray-200 fill-gray-200'}`}
                  />
                )
              })}
            </div>
            {/* Rating number */}
            <span className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
            {/* Google logo */}
            <span className="text-sm text-gray-500">on</span>
            <svg className="w-14 h-5" viewBox="0 0 74 24">
              <path fill="#4285F4" d="M9.24 8.19v2.46h5.88c-.18 1.38-.64 2.39-1.34 3.1-.86.86-2.2 1.8-4.54 1.8-3.62 0-6.45-2.92-6.45-6.54s2.83-6.54 6.45-6.54c1.95 0 3.38.77 4.43 1.76L15.4 2.5C13.94 1.08 11.98 0 9.24 0 4.28 0 .11 4.04.11 9s4.17 9 9.13 9c2.68 0 4.7-.88 6.28-2.52 1.62-1.62 2.13-3.91 2.13-5.75 0-.57-.04-1.1-.13-1.54H9.24z"/>
              <path fill="#EA4335" d="M25 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z"/>
              <path fill="#FBBC05" d="M53.58 7.49h-.09c-.57-.68-1.67-1.3-3.06-1.3C47.53 6.19 45 8.72 45 12c0 3.26 2.53 5.81 5.43 5.81 1.39 0 2.49-.62 3.06-1.32h.09v.81c0 2.22-1.19 3.41-3.1 3.41-1.56 0-2.53-1.12-2.93-2.07l-2.22.92c.64 1.54 2.33 3.43 5.15 3.43 2.99 0 5.52-1.76 5.52-6.05V6.49h-2.42v1zm-2.93 8.03c-1.76 0-3.1-1.5-3.1-3.52 0-2.05 1.34-3.52 3.1-3.52 1.74 0 3.1 1.5 3.1 3.54 0 2.02-1.36 3.5-3.1 3.5z"/>
              <path fill="#4285F4" d="M58 .24h2.51v17.57H58z"/>
              <path fill="#34A853" d="M68.26 15.52c-1.3 0-2.22-.59-2.82-1.76l7.77-3.21-.26-.66c-.48-1.3-1.96-3.7-4.97-3.7-2.99 0-5.48 2.35-5.48 5.81 0 3.26 2.46 5.81 5.76 5.81 2.66 0 4.2-1.63 4.84-2.57l-1.98-1.32c-.66.96-1.56 1.6-2.86 1.6zm-.18-7.15c1.03 0 1.91.53 2.2 1.28l-5.25 2.17c0-2.44 1.73-3.45 3.05-3.45z"/>
              <path fill="#EA4335" d="M40.75 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z"/>
            </svg>
          </div>
        </div>
        
        {/* Carousel */}
        <ReviewCarousel 
          reviews={filteredReviews} 
          speed={carouselSpeed}
          accentColor={accentColor}
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      <ReactGoogleReviews
        featurableId={featurableId}
        layout="custom"
        renderer={customRenderer}
        structuredData={true}
        brandName="Mosquito Curtains"
        accessibility={true}
      />
    </div>
  )
}
