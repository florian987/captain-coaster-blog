import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
})

// GET request handler to retrieve view count
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params
    const slug = resolvedParams.slug

    // Get the current view count for the slug
    const views = await redis.get<number>(`views:${slug}`)

    // Return the view count (default to 0 if not found)
    return NextResponse.json({ views: views || 0 })
  } catch (error) {
    // Return 0 views instead of an error to prevent disrupting the user experience
    return NextResponse.json({ views: 0, status: 'error' })
  }
}

// POST request handler to increment view count
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params
    const slug = resolvedParams.slug

    // Increment the view count for the slug
    const views = await redis.incr(`views:${slug}`)

    // Return the updated view count
    return NextResponse.json({ views })
  } catch (error) {
    // Return 0 views instead of an error to prevent disrupting the user experience
    return NextResponse.json({ views: 0, status: 'error' })
  }
}
