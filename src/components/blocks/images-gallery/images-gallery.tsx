import { useGetImagesQuery } from '@/apis/image/hooks/use-image-request'
import type { IImage } from '@/apis/image/types'
import type { ItemType } from '@/common/constants/enums'
import { getImageUrl } from '@/common/helpers/get-image-url'
import { GalleryUpload } from '@/components/shared/gallery-upload'
import Image from '@/components/shared/image'
import { Checkbox } from '@/components/ui/checkbox'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { Typography } from '@/components/ui/typography'
import { groupBy } from 'lodash-es'
import { ImageIcon } from 'lucide-react'
import type React from 'react'

type TImagesGalleryProps = { type: 'any' | ItemType; selected?: IImage[]; onSelect?: (value: IImage[]) => any }

const ImagesGallary: React.FC<TImagesGalleryProps> = ({ selected, onSelect, type = 'any' }) => {
  const { data: images, isLoading } = useGetImagesQuery()

  console.log(images)

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
        Object.entries(
          groupBy(
            images.filter((item) => {
              if (type === 'any') return true
              return item.category?.type === type
            }),
            (img) => `${img.category_id}.${img?.category?.name}`
          )
        ).map(([category, images]) => (
          <div className="flex flex-col space-y-3">
            <Typography variant="small" color="muted">
              {category.split('.').at(-1)}
            </Typography>
            <div className="grid grid-cols-2 md:max-lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {images.map((image) => (
                <label key={image.id} className="relative cursor-pointer" htmlFor={`image-${image.id}`}>
                  <Checkbox
                    id={`image-${image.id}`}
                    className="absolute top-2 left-2"
                    checked={Array.isArray(selected) && selected.some((img) => img.id === image.id)}
                    onCheckedChange={(checked) => {
                      if (typeof onSelect === 'function') {
                        if (checked) onSelect([...selected!, image])
                        else onSelect(selected!?.filter((img) => img.id !== image.id))
                      }
                    }}
                  />
                  <Image
                    src={getImageUrl(image.dest)}
                    alt={image.file_name}
                    className="w-full aspect-square object-cover rounded"
                  />
                </label>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default ImagesGallary
