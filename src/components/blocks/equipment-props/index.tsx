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
import DeleteAlertDialog from './delete-alert-dialog'
import CostumeFormDialog from './equipment-props-form-dialog'
import EquipmentPropsFormDialogTrigger from './equipment-props-form-dialog-trigger'
import EquipmentPropsTable from './equipment-props-table'

const EquipmentPropsPage: React.FC = () => {
  const { title, description } = usePageHelperText('main')

  return (
    <PageEventProvider>
      <PageWrapper>
        <PageHeader>
          <PageTitle>{title}</PageTitle>
          <PageDescription>{description}</PageDescription>
          <PageAction>
            <EquipmentPropsFormDialogTrigger />
          </PageAction>
        </PageHeader>
        <PageSeparator />
        <PageContent>
          <EquipmentPropsTable />
        </PageContent>
      </PageWrapper>
      <CostumeFormDialog />
      <DeleteAlertDialog />
    </PageEventProvider>
  )
}

const PageContent: React.FC<React.ComponentProps<'section'>> = tw.section`flex-1`

export default EquipmentPropsPage
