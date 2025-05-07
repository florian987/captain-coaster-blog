'use client'

import { useEffect, useState } from 'react'

interface ViewCounterProps {
  slug: string
  trackView?: boolean
  className?: string
}

export default function ViewCounter({ slug, trackView = true, className = '' }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Function to fetch the view count
    const fetchViews = async () => {
      try {
        const res = await fetch(`/api/views/${slug}`)
        if (!res.ok) throw new Error('Failed to fetch view count')
        const data = await res.json()

        // Don't show counter if status is error or disabled
        if (data.status === 'error' || data.status === 'disabled') {
          setHasError(true)
          return
        }

        setViews(data.views)
      } catch (error) {
        // Set error state to hide counter
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    // Function to increment the view count
    const incrementViews = async () => {
      try {
        const res = await fetch(`/api/views/${slug}`, { method: 'POST' })
        if (!res.ok) throw new Error('Failed to increment view count')
        const data = await res.json()

        // Don't show counter if status is error or disabled
        if (data.status === 'error' || data.status === 'disabled') {
          setHasError(true)
          return
        }

        setViews(data.views)
      } catch (error) {
        // Set error state to hide counter
        setHasError(true)
      }
    }

    // First fetch the current view count
    fetchViews()

    // Only increment the view count once per session if trackView is true
    if (trackView) {
      // Check if this post has been viewed in this session
      const hasViewed = sessionStorage.getItem(`viewed-${slug}`)
      if (!hasViewed) {
        incrementViews()
        // Mark this post as viewed in this session
        sessionStorage.setItem(`viewed-${slug}`, 'true')
      }
    }
  }, [slug, trackView])

  // Don't render anything if there's an error or it's disabled
  if (hasError) {
    return null
  }

  return (
    <span className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      {isLoading ? '' : `${views?.toLocaleString() || 0} view${views === 1 ? '' : 's'}`}
    </span>
  )
}
