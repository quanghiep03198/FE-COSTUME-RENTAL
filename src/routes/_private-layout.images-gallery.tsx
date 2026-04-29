import { getImagesQueryOptions } from '@/apis/image/hooks/use-image-request'
import { searchImagesSchema } from '@/apis/image/schemas/search.schema'
import ImagesGalleryPage from '@/components/blocks/images-gallery'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-layout/images-gallery')({
  component: ImagesGalleryPage,
  loader: async ({ context }) => {
    return await await context.queryClient.ensureQueryData(getImagesQueryOptions())
  },
  validateSearch: searchImagesSchema,
})
