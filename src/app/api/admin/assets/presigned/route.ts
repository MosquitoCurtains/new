import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'mosquitocurtains-bucket'
const CDN_URL = process.env.AWS_CLOUDFRONT_URL || 'https://static.mosquitocurtains.com'
const SITE_ASSETS_PREFIX = 'site-assets/'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, fileType } = body

    if (!key || !fileType) {
      return NextResponse.json(
        { error: 'key and fileType are required' },
        { status: 400 }
      )
    }

    if (!key.startsWith(SITE_ASSETS_PREFIX)) {
      return NextResponse.json(
        { error: 'Key must be under site-assets/' },
        { status: 400 }
      )
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      CacheControl: 'public, max-age=31536000, immutable',
    })

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    })

    const publicUrl = `${CDN_URL}/${key}`

    return NextResponse.json({
      presignedUrl,
      uploadUrl: presignedUrl,
      publicUrl,
      key,
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
