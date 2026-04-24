import {
  PageAction,
  PageDescription,
  PageHeader,
  PageSeparator,
  PageTitle,
  PageWrapper,
} from '@/components/layouts/app/app-page'
import { PageEventProvider } from '@/contexts/event-context'
import React from 'react'
import CreateEmployeeFormDialogTrigger from './create-employee-dialog-form-trigger'
import EmployeeFormDialog from './employee-form-dialog'
import EmployeeTable from './employee-table'

const EmployeePage: React.FC = () => {
  return (
    <PageEventProvider>
      <PageWrapper>
        <PageHeader>
          <PageTitle>Quản lý nhân sự</PageTitle>
          <PageDescription>
            Trung tâm điều phối thông tin toàn bộ nhân sự: Thêm mới, chỉnh sửa, phân quyền và xuất báo cáo tập trung.
          </PageDescription>
          <PageAction>
            <CreateEmployeeFormDialogTrigger />
          </PageAction>
        </PageHeader>
        <PageSeparator />
        <EmployeeTable />
      </PageWrapper>
      <EmployeeFormDialog />
    </PageEventProvider>
  )
}

export default EmployeePage
