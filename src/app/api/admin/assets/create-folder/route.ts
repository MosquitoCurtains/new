import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'mosquitocurtains-bucket'
const SITE_ASSETS_PREFIX = 'site-assets/'

export async function POST(request: NextRequest) {
  try {
    const { folderName, parentPath } = await request.json()

    if (!folderName || !folderName.trim()) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 })
    }

    const pathParts: string[] = []
    if (parentPath && Array.isArray(parentPath) && parentPath.length > 0) {
      pathParts.push(...parentPath.map(p => p.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')))
    }
    pathParts.push(folderName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'))

    const folderPath = pathParts.join('/')
    const placeholderKey = `${SITE_ASSETS_PREFIX}${folderPath}/.keep`

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: placeholderKey,
      Body: Buffer.from(''),
      ContentType: 'text/plain',
      CacheControl: 'no-cache',
    })

    await s3Client.send(command)

    return NextResponse.json({
      success: true,
      folderPath,
      key: placeholderKey,
    })
  } catch (error) {
    console.error('Error creating folder:', error)
    return NextResponse.json(
      { error: 'Failed to create folder', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
