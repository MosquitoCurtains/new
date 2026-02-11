import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || ''

    const prefix = category
      ? `${SITE_ASSETS_PREFIX}${category}/`
      : SITE_ASSETS_PREFIX

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      Delimiter: '/',
    })

    const response = await s3Client.send(command)

    const subfolders: string[] = []
    const files: Array<{
      key: string
      url: string
      name: string
      size: number
      lastModified?: Date
      category: string
      path: string
    }> = []

    if (response.CommonPrefixes) {
      for (const commonPrefix of response.CommonPrefixes) {
        if (commonPrefix.Prefix) {
          const fullPath = commonPrefix.Prefix.replace(SITE_ASSETS_PREFIX, '').replace(/\/$/, '')

          if (category) {
            const categoryPath = `${category}/`
            if (fullPath.startsWith(categoryPath)) {
              const remainingPath = fullPath.replace(categoryPath, '')
              const parts = remainingPath.split('/')
              if (parts.length === 1 && parts[0]) {
                subfolders.push(parts[0])
              }
            }
          } else {
            const parts = fullPath.split('/')
            if (parts.length === 1 && parts[0]) {
              subfolders.push(parts[0])
            }
          }
        }
      }
    }

    if (response.Contents) {
      for (const obj of response.Contents) {
        if (obj.Key && !obj.Key.endsWith('/')) {
          if (obj.Key.endsWith('/.keep')) {
            continue
          }

          const pathAfterPrefix = obj.Key.replace(SITE_ASSETS_PREFIX, '')
          const pathParts = pathAfterPrefix.split('/')
          const fileName = pathParts[pathParts.length - 1]
          const filePath = pathParts.slice(0, -1).join('/')
          const topLevelCategory = pathParts[0]

          const cloudfrontUrl = `${CDN_URL}/${obj.Key}`

          files.push({
            key: obj.Key,
            url: cloudfrontUrl,
            name: fileName,
            size: obj.Size || 0,
            lastModified: obj.LastModified,
            category: topLevelCategory,
            path: filePath,
          })
        }
      }
    }

    if (category) {
      return NextResponse.json({
        category,
        subfolders: subfolders.sort(),
        files: files.sort((a, b) => a.name.localeCompare(b.name)),
      })
    }

    const topLevelCategories = subfolders.filter(f => !f.includes('/'))
    const filesByCategory: Record<string, typeof files> = {}
    files.forEach(file => {
      if (!filesByCategory[file.category]) {
        filesByCategory[file.category] = []
      }
      filesByCategory[file.category].push(file)
    })

    return NextResponse.json({
      categories: topLevelCategories.sort(),
      subfolders: subfolders.sort(),
      filesByCategory,
    })
  } catch (error) {
    console.error('Error listing S3 assets:', error)
    return NextResponse.json(
      { error: 'Failed to list assets', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
