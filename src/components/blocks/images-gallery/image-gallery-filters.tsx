import { ImageMimeType } from '@/apis/image/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useNavigate, useSearch } from '@tanstack/react-router'
import React from 'react'

type Props = {}

const ImagesGalleryFilters: React.FC = () => {
  const search = useSearch({ from: '/_private-layout/images-gallery', structuralSharing: true, strict: true })
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-x-2">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Loại" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(ImageMimeType).map(([extensions, mimeType]) => (
            <SelectItem key={mimeType} value={mimeType}>
              {extensions}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default ImagesGalleryFilters
