import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/projects/share/photos
 * Public endpoint: Save uploaded photo records to a project using the share token.
 * Photos must already be uploaded to S3 via presigned URL.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, photos, category = 'planning' } = body
    const safeCategory = (category === 'installed') ? 'installed' : 'planning'

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Share token required' },
        { status: 400 }
      )
    }

    if (!Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json(
        { error: 'photos array is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Verify project exists by share token
    const { data: project, error: projError } = await supabase
      .from('projects')
      .select('id')
      .eq('share_token', token)
      .single()

    if (projError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const rows = photos.map(
      (p: { url: string; fileName?: string; contentType?: string; sizeBytes?: number }) => ({
        project_id: project.id,
        storage_path: p.url,
        filename: p.fileName || 'unknown',
        content_type: p.contentType || guessContentType(p.fileName || p.url),
        size_bytes: p.sizeBytes || null,
        category: safeCategory,
      })
    )

    const { data, error } = await supabase
      .from('project_photos')
      .insert(rows)
      .select('*')

    if (error) {
      console.error('Error inserting project photos:', error)
      return NextResponse.json(
        { error: 'Failed to add photos' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, photos: data })
  } catch (error) {
    console.error('Project share photos POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function guessContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    heic: 'image/heic',
    pdf: 'application/pdf',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    webm: 'video/webm',
  }
  return map[ext || ''] || 'image/jpeg'
}
