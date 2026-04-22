import { getEmployeeQueryOptions } from '@/apis/employee/hooks/use-employee-request'
import CreateEmployeeFormDialogTrigger from '@/components/blocks/employee/create-employee-dialog-form-trigger'
import EmployeeFormDialog from '@/components/blocks/employee/employee-form-dialog'
import EmployeeTable from '@/components/blocks/employee/employee-table'
import {
  PageAction,
  PageDescription,
  PageHeader,
  PageSeparator,
  PageTitle,
  PageWrapper,
} from '@/components/layouts/app/app-page'
import { PageEventProvider } from '@/contexts/event-context'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-layout/employees')({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: 'Quản lý nhân sự' },
      {
        name: 'description',
        content: `Hệ thống quản lý danh bạ nhân sự toàn diện — lưu trữ, tìm kiếm và cập nhật thông tin liên lạc của toàn bộ nhân viên một cách nhanh chóng, chính xác và bảo mật. Tối ưu hóa quy trình quản lý nội bộ, giúp doanh nghiệp kết nối hiệu quả hơn.`,
      },
    ],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getEmployeeQueryOptions())
  },
})

function RouteComponent() {
  return (
    <PageEventProvider>
      <PageWrapper>
        <PageHeader>
          <PageTitle>Quản lý nhân sự</PageTitle>
          <PageDescription>
            Trung tâm điều phối thông tin toàn bộ nhân sự: Thêm mới, chỉnh sửa,
            phân quyền và xuất báo cáo tập trung.
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
