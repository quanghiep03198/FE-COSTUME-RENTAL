import { UserRole } from '@/apis/auth/constants'
import type { IconProps } from '@/components/ui/icon'
import type { FileRouteTypes } from '@/routeTree.gen'

export type TNavigationConfig = {
  icon?: IconProps['name']
  title: string
  url?: FileRouteTypes['to']
  items?: Omit<TNavigationConfig, 'icon'>[]
  authorizedRoles?: UserRole[] | '*'
  description: string
}
const navigationConfig: Record<'main' | 'administration', TNavigationConfig[]> =
  {
    main: [
      {
        title: 'Kho đạo cụ & trang phục',
        url: '/costume-warehouse',
        icon: 'Warehouse',
        authorizedRoles: [UserRole.ADMIN, UserRole.USER],
        description:
          'Quản lý kho trang phục: thêm, sửa, xóa trang phục, phân loại theo loại, kích cỡ, màu sắc và tình trạng để vận hành hiệu quả.',
      },
      {
        title: 'Bảo trì',
        url: '/maintenance',
        icon: 'Wrench',
        authorizedRoles: [UserRole.ADMIN, UserRole.USER],
        description:
          'Quản lý bảo trì trang phục và đạo cụ: theo dõi tình trạng, lên lịch bảo trì định kỳ và xử lý sự cố để đảm bảo chất lượng và độ bền.',
      },
      {
        title: 'Mượn/trả nội bộ',
        url: '/internal-borrowing',
        icon: 'ArrowLeftRight',
        authorizedRoles: [UserRole.ADMIN, UserRole.USER],
        description: 'Hệ thống quản lý lưu thông đạo cụ & trang phục nội bộ',
      },

      {
        title: 'Quản lý Khách thuê',
        url: '/customer-rental-agreement',
        icon: 'Handshake',
        authorizedRoles: [UserRole.ADMIN, UserRole.USER],
        description: 'Hệ thống quản lý lưu thông đạo cụ & trang phục nội bộ',
      },
      {
        title: 'Mượn/trả của khách',
        url: '/rental-receipts',
        icon: 'ArrowRightLeft',
        authorizedRoles: [UserRole.ADMIN, UserRole.USER],
        description: 'Hệ thống quản lý lưu thông đạo cụ & trang phục nội bộ',
      },
      {
        title: 'Quản lý hóa đơn',
        url: '/invoices',
        icon: 'Receipt',
        authorizedRoles: [UserRole.ADMIN, UserRole.USER],
        description:
          'Quản lý hóa đơn: tạo, xem, chỉnh sửa và xóa hóa đơn thuê trang phục, theo dõi trạng thái thanh toán và lịch sử giao dịch để đảm bảo quản lý tài chính hiệu quả.',
      },
    ],
    administration: [
      {
        title: 'Thống kê',
        url: '/statistics',
        icon: 'ChartColumnBig',
        authorizedRoles: [UserRole.ADMIN],
        description:
          'Báo cáo và phân tích hiệu suất nhà hàng: doanh thu, đặt bàn, món bán chạy và hoạt động nhân viên để ra quyết định hiệu quả.',
      },
      {
        title: 'Quản lý truy cập',
        url: '/users',
        icon: 'UserCog',
        authorizedRoles: [UserRole.ADMIN],
        description:
          'Quản lý nhân sự: tạo tài khoản, phân quyền, theo dõi ca kíp và vai trò để vận hành nhà hàng an toàn và hiệu quả.',
      },
      {
        title: 'Quản lý nhân viên',
        url: '/employees',
        icon: 'Users',
        authorizedRoles: [UserRole.ADMIN],
        description:
          'Quản lý nhân sự: tạo tài khoản, phân quyền, theo dõi ca kíp và vai trò để vận hành nhà hàng an toàn và hiệu quả.',
      },
    ],
  }

export default navigationConfig
