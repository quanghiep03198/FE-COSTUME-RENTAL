import type { TUpdateImageValues } from '@/apis/image/schemas/update-image.schema'
import {
  PageAction,
  PageDescription,
  PageHeader,
  PageSeparator,
  PageTitle,
  PageWrapper,
} from '@/components/layouts/app/app-page'
import { createPubSubContext } from '@/contexts/pubsub-context'
import { usePageHelperText } from '@/hooks/use-page-helper-text'
import ImageUploadDialogTrigger from './image-upload-dialog-trigger'
import ImageGalleryTable from './images-gallery-table'
import ImageGalleryToolbar from './images-gallery-toolbar'
import UploadImageDialog from './upload-image-dialog'

type GlobalPubSubEventMap = {
  'image:delete': number
  'image:create': {}
  'image:update': TUpdateImageValues
}

export const { PubSubProvider, usePubSub, usePubSubSubscription } =
  createPubSubContext<GlobalPubSubEventMap>('GalleryPubSubContext')

const ImagesGalleryPage: React.FC = () => {
  const { title, description } = usePageHelperText('main')

  return (
    <PubSubProvider>
      <PageWrapper>
        <PageHeader>
          <PageTitle>{title}</PageTitle>
          <PageDescription>{description}</PageDescription>
          <PageAction>
            <ImageUploadDialogTrigger />
          </PageAction>
        </PageHeader>
        <PageSeparator />
        <ImageGalleryToolbar />
        <ImageGalleryTable />
        <UploadImageDialog />
      </PageWrapper>
    </PubSubProvider>
  )
}

export default ImagesGalleryPage
