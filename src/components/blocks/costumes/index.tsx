import { PageDescription, PageHeader, PageTitle, PageWrapper } from '@/components/layouts/app/app-page'

const CostumePage: React.FC = () => {
  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>{document?.title}</PageTitle>
        <PageDescription></PageDescription>
      </PageHeader>
    </PageWrapper>
  )
}

export default CostumePage
