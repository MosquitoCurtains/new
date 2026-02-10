import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/admin/projects/[id]/photos
 * List all photos/videos for a project.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('project_photos')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching project photos:', error)
      return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 })
    }

    return NextResponse.json({ photos: data || [] })
  } catch (error) {
    console.error('Project photos GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/projects/[id]/photos
 * Add photo records to a project (after files are already uploaded to S3).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { photos } = body

    if (!Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json(
        { error: 'photos array is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Verify project exists
    const { data: project, error: projError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .single()

    if (projError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const rows = photos.map((p: { url: string; fileName?: string; contentType?: string; sizeBytes?: number }) => ({
      project_id: id,
      storage_path: p.url,
      filename: p.fileName || 'unknown',
      content_type: p.contentType || guessContentType(p.fileName || p.url),
      size_bytes: p.sizeBytes || null,
    }))

    const { data, error } = await supabase
      .from('project_photos')
      .insert(rows)
      .select('*')

    if (error) {
      console.error('Error inserting project photos:', error)
      return NextResponse.json({ error: 'Failed to add photos' }, { status: 500 })
    }

    return NextResponse.json({ success: true, photos: data })
  } catch (error) {
    console.error('Project photos POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function guessContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    webp: 'image/webp', heic: 'image/heic', pdf: 'application/pdf',
    mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm',
  }
  return map[ext || ''] || 'image/jpeg'
}
