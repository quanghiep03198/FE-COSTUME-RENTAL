import {
  PageAction,
  PageDescription,
  PageHeader,
  PageSeparator,
  PageTitle,
  PageWrapper,
} from '@/components/layouts/app/app-page'
import { PageEventProvider } from '@/contexts/event-context'
import { usePageHelperText } from '@/hooks/use-page-helper-text'
import tw from '@/lib/tw'
import CostumeFormDialog from './costume-form-dialog'
import CostumeFormDialogTrigger from './costume-form-dialog-trigger'
import CostumeTable from './costumes-table'
import DeleteAlertDialog from './delete-alert-dialog'

const CostumePage: React.FC = () => {
  const { title, description } = usePageHelperText('main')

  return (
    <PageEventProvider>
      <PageWrapper>
        <PageHeader>
          <PageTitle>{title}</PageTitle>
          <PageDescription>{description}</PageDescription>
          <PageAction>
            <CostumeFormDialogTrigger />
          </PageAction>
        </PageHeader>
        <PageSeparator />
        <PageContent>
          <CostumeTable />
        </PageContent>
      </PageWrapper>
      <CostumeFormDialog />
      <DeleteAlertDialog />
    </PageEventProvider>
  )
}

const PageContent: React.FC<React.ComponentProps<'section'>> = tw.section`flex-1`

export default CostumePage
