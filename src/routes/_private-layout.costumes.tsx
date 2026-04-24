import CostumePage from '@/components/blocks/costumes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-layout/costumes')({
  component: CostumePage,
  head: () => ({
    meta: [
      { title: 'Quản lý trang phục' },
      {
        name: 'description',
        content: `Quản lý trang phục: thêm, sửa, xóa trang phục, phân loại theo loại, kích cỡ, màu sắc và tình trạng để vận hành hiệu quả.`,
      },
    ],
  }),
})
