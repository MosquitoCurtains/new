'use client'

/**
 * PhotoUploader Component
 * 
 * Drag-and-drop photo upload with preview, progress, and S3 integration.
 * Used in the Start Project wizard.
 * Follows Mosquito Curtains Design System patterns.
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Spinner } from '@/lib/design-system'

// =============================================================================
// TYPES
// =============================================================================

export interface UploadedPhoto {
  id: string
  fileName: string
  publicUrl: string
  key: string
  status: 'uploading' | 'complete' | 'error'
  progress: number
  error?: string
  preview?: string
}

interface PhotoUploaderProps {
  projectId?: string
  sessionId?: string
  maxFiles?: number
  onUploadComplete?: (photos: UploadedPhoto[]) => void
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PhotoUploader({
  projectId,
  sessionId,
  maxFiles = 10,
  onUploadComplete,
  className,
}: PhotoUploaderProps) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const onUploadCompleteRef = useRef(onUploadComplete)

  // Keep ref updated
  useEffect(() => {
    onUploadCompleteRef.current = onUploadComplete
  }, [onUploadComplete])

  // Sync completed photos to parent
  useEffect(() => {
    const completedPhotos = photos.filter(p => p.status === 'complete')
    onUploadCompleteRef.current?.(completedPhotos)
  }, [photos])

  // ===========================================================================
  // FILE HANDLING
  // ===========================================================================

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files)
    
    // Check max files limit
    if (photos.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Process each file
    for (const file of fileArray) {
      await uploadFile(file)
    }
  }, [photos.length, maxFiles])

  const uploadFile = async (file: File) => {
    // Create preview
    const preview = URL.createObjectURL(file)
    const id = `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Add to state as uploading
    const newPhoto: UploadedPhoto = {
      id,
      fileName: file.name,
      publicUrl: '',
      key: '',
      status: 'uploading',
      progress: 0,
      preview,
    }

    setPhotos(prev => [...prev, newPhoto])

    try {
      // 1. Get presigned URL
      const presignedResponse = await fetch('/api/uploads/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadType: 'project-photo',
          projectId,
          sessionId,
        }),
      })

      if (!presignedResponse.ok) {
        const error = await presignedResponse.json()
        throw new Error(error.error || 'Failed to get upload URL')
      }

      const { presignedUrl, publicUrl, key } = await presignedResponse.json()

      // Update progress
      setPhotos(prev => prev.map(p => 
        p.id === id ? { ...p, progress: 30 } : p
      ))

      // 2. Upload to S3
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text()
        console.error('S3 upload error:', uploadResponse.status, errorText)
        throw new Error(`Upload failed: ${uploadResponse.status}`)
      }

      // 3. Mark as complete
      setPhotos(prev => prev.map(p => 
        p.id === id 
          ? { ...p, status: 'complete' as const, progress: 100, publicUrl, key }
          : p
      ))

    } catch (error) {
      console.error('Upload error:', error)
      setPhotos(prev => prev.map(p => 
        p.id === id 
          ? { ...p, status: 'error' as const, error: (error as Error).message }
          : p
      ))
    }
  }

  // ===========================================================================
  // DRAG & DROP
  // ===========================================================================

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }, [handleFiles])

  const removePhoto = useCallback((id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id))
  }, [])

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
          'hover:border-[#406517] hover:bg-[#406517]/5',
          isDragging && 'border-[#406517] bg-[#406517]/10',
          !isDragging && 'border-gray-300 bg-gray-50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,video/mp4,video/quicktime,video/webm"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center',
            isDragging ? 'bg-[#406517]/20' : 'bg-gray-100'
          )}>
            <Upload className={cn(
              'w-8 h-8',
              isDragging ? 'text-[#406517]' : 'text-gray-400'
            )} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragging ? 'Drop files here' : 'Drag photos or videos here, or click to browse'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Images: JPG, PNG, WebP, HEIC (up to 10MB) &middot; Videos: MP4, MOV, WebM (up to 100MB)
            </p>
          </div>
          
          <p className="text-xs text-gray-400">
            {photos.length} / {maxFiles} files
          </p>
        </div>
      </div>

      {/* Photo Previews */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div 
              key={photo.id}
              className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-square border border-gray-200"
            >
              {/* Preview Image/Video */}
              {photo.preview ? (
                /\.(mp4|mov|webm)$/i.test(photo.fileName) ? (
                  <video
                    src={photo.preview}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={photo.preview}
                    alt={photo.fileName}
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                </div>
              )}

              {/* Status Overlay */}
              <div className={cn(
                'absolute inset-0 flex items-center justify-center transition-opacity',
                photo.status === 'uploading' && 'bg-white/80',
                photo.status === 'error' && 'bg-red-500/60',
                photo.status === 'complete' && 'bg-black/0 group-hover:bg-black/40'
              )}>
                {photo.status === 'uploading' && (
                  <div className="text-center">
                    <Spinner size="lg" />
                    <p className="text-gray-700 text-sm mt-2">{photo.progress}%</p>
                  </div>
                )}
                
                {photo.status === 'error' && (
                  <div className="text-center px-2">
                    <AlertCircle className="w-8 h-8 text-white mx-auto" />
                    <p className="text-white text-xs mt-1">{photo.error}</p>
                  </div>
                )}
                
                {photo.status === 'complete' && (
                  <CheckCircle2 className="w-8 h-8 text-[#406517] opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removePhoto(photo.id)
                }}
                className={cn(
                  'absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center',
                  'opacity-0 group-hover:opacity-100 transition-opacity',
                  'hover:bg-red-50 hover:border-red-200 hover:text-red-500',
                  'shadow-sm'
                )}
              >
                <X className="w-4 h-4" />
              </button>

              {/* File Name */}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white text-xs truncate">{photo.fileName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
