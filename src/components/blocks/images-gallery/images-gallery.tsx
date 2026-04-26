import { useGetImagesQuery } from '@/apis/image/hooks/use-image-request'
import { GalleryUpload } from '@/components/shared/gallery-upload'
import Image from '@/components/shared/image'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { Typography } from '@/components/ui/typography'
import { groupBy } from 'lodash-es'
import { ImageIcon } from 'lucide-react'
import type React from 'react'

const ImagesGallary: React.FC = () => {
  const { data: images, isLoading } = useGetImagesQuery()

  return (
    <div className="space-y-10">
      {isLoading ? (
        Array.from({ length: 12 }, (_, i) => <Skeleton key={i} className="max-w-sm aspect-square" />)
      ) : !Array.isArray(images) || images.length === 0 ? (
        <Empty>
          <EmptyMedia variant="icon">
            <ImageIcon />
          </EmptyMedia>
          <EmptyContent>
            <EmptyHeader>
              <EmptyTitle>Không tìm thấy hình ảnh nào</EmptyTitle>
              <EmptyDescription>
                Có vẻ như bạn chưa tải lên hình ảnh nào. Hãy bắt đầu bằng cách thêm một hình ảnh mới để hiển thị ở đây.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <GalleryUpload />
            </EmptyContent>
          </EmptyContent>
        </Empty>
      ) : (
        Object.entries(groupBy(images, (img) => `${img.category_id}.${img.category.name}`)).map(
          ([category, images]) => (
            <div className="space-y-3">
              <Typography variant="small" color="muted">
                {category.split('.').at(-1)}
              </Typography>
              <div className="grid grid-cols-2 md:max-lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {images.map((image) => (
                  <Image
                    key={image.id}
                    src={image.dest}
                    alt={image.file_name}
                    className="w-full aspect-square object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )
        )
      )}
    </div>
  )
}

export default ImagesGallary
