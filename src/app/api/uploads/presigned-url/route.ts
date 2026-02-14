/**
 * S3 Presigned URL Generator
 * 
 * Generates presigned URLs for secure client-side uploads to S3.
 * Files are organized by type: project-photos, diagrams, etc.
 */

import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { nanoid } from 'nanoid'

// =============================================================================
// CONFIG
// =============================================================================

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'mosquitocurtains-bucket'
const REGION = process.env.AWS_REGION || 'us-east-1'
const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL || 'https://static.mosquitocurtains.com'

// Allowed file types and their MIME types
const ALLOWED_TYPES: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/heic': ['.heic'],
  'application/pdf': ['.pdf'],
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
  'video/webm': ['.webm'],
}

// Video MIME types (for size limit differentiation)
const VIDEO_TYPES = new Set(['video/mp4', 'video/quicktime', 'video/webm'])

// Max file sizes
const MAX_IMAGE_SIZE = 10 * 1024 * 1024    // 10MB for images/PDFs
const MAX_VIDEO_SIZE = 100 * 1024 * 1024   // 100MB for videos

// Upload paths by type
const UPLOAD_PATHS: Record<string, string> = {
  'project-photo': 'user-uploads/project-photos',
  'diagram': 'user-uploads/diagrams',
  'attachment': 'user-uploads/attachments',
  'gallery-image': 'gallery/images',
}

// =============================================================================
// S3 CLIENT
// =============================================================================

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

// =============================================================================
// API HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    // Validate AWS credentials are configured
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return NextResponse.json(
        { error: 'S3 not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { 
      fileName, 
      fileType, 
      fileSize, 
      uploadType = 'project-photo',
      projectId,
      sessionId,
      photoCategory,
    } = body

    // Validate required fields
    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'fileName and fileType are required' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES[fileType]) {
      return NextResponse.json(
        { error: `File type ${fileType} not allowed. Allowed types: ${Object.keys(ALLOWED_TYPES).join(', ')}` },
        { status: 400 }
      )
    }

    // Validate file size (different limits for video vs image)
    const maxSize = VIDEO_TYPES.has(fileType) ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
    if (fileSize && fileSize > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max size: ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Validate upload type
    if (!UPLOAD_PATHS[uploadType]) {
      return NextResponse.json(
        { error: `Invalid uploadType. Allowed: ${Object.keys(UPLOAD_PATHS).join(', ')}` },
        { status: 400 }
      )
    }

    // Generate unique file key
    const ext = fileName.split('.').pop()?.toLowerCase() || 'jpg'
    const uniqueId = nanoid(12)
    
    // Build the S3 key
    // Project photos use: user-uploads/project-photos/[projectId]/planning|installed/file
    // Other uploads use:  user-uploads/[type]/[date]/[id]/file
    const category = (photoCategory === 'installed') ? 'installed' : 'planning'
    const s3Key = (uploadType === 'project-photo' && projectId)
      ? [
          UPLOAD_PATHS[uploadType],
          projectId,
          category,
          `${uniqueId}-${sanitizeFileName(fileName)}`,
        ].join('/')
      : [
          UPLOAD_PATHS[uploadType],
          new Date().toISOString().split('T')[0], // YYYY-MM-DD
          projectId || sessionId || 'anonymous',
          `${uniqueId}-${sanitizeFileName(fileName)}`,
        ].join('/')

    // Create presigned URL
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      ContentType: fileType,
      // Add metadata
      Metadata: {
        'original-filename': fileName,
        'upload-type': uploadType,
        ...(projectId && { 'project-id': projectId }),
        ...(sessionId && { 'session-id': sessionId }),
      },
    })

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL expires in 1 hour
    })

    // Build the public URL (via CloudFront)
    const publicUrl = `${CLOUDFRONT_URL}/${s3Key}`

    return NextResponse.json({
      presignedUrl,
      publicUrl,
      key: s3Key,
      expiresIn: 3600,
    })

  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Sanitize filename to be safe for S3
 */
function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100)
}
