import { getUsersQueryOptions } from '@/apis/user/hooks/use-user-request'
import type { IUser } from '@/apis/user/types'
import { formatPhoneNumber } from '@/common/helpers/format-intl'
import { DataGrid } from '@/components/shared/data-grid'
import TableCellText from '@/components/shared/data-grid/components/table-cell-text'
import { ROW_ACTIONS_COLUMN_ID } from '@/components/shared/data-grid/constants'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Icon, type IconProps } from '@/components/ui/icon'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Typography } from '@/components/ui/typography'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'
import RoleBadge from './role-badge'
import UserActionDropdown from './user-action-dropdown'
import UserTableToolbar from './user-table-toolbar'

const UserTable: React.FC = () => {
  const { data, isLoading } = useSuspenseQuery(getUsersQueryOptions())

  const columnHelper = createColumnHelper<IUser>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('employee.full_name', {
        header: 'Họ tên & Email',
        size: 200,
        cell: ({ getValue, row }) => {
          return (
            <Item size="xs" className="p-0">
              <ItemMedia>
                <Avatar className="col-start-1 row-span-2">
                  <AvatarImage
                    src={row.original.avatar}
                    alt={row.original.employee?.full_name}
                  />
                  <AvatarFallback>G</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{getValue()}</ItemTitle>
                <ItemDescription>{row.original.username}</ItemDescription>
              </ItemContent>
            </Item>
          )
        },
      }),
      columnHelper.accessor('employee.email', {
        header: 'Email',
        cell: TableCellText,
      }),
      columnHelper.accessor('employee.phone', {
        header: 'Số điện thoại',
        cell: ({ getValue }) => {
          const value = getValue()
          if (!value)
            return (
              <Typography variant="small" color="muted">
                Chưa xác định
              </Typography>
            )
          return formatPhoneNumber(value)
        },
      }),
      columnHelper.accessor('role', {
        id: 'role',
        header: 'Vai trò',
        cell: ({ getValue }) => <RoleBadge value={getValue()} />,
        filterFn: 'arrIncludesSome',
        enableSorting: true,
        enableColumnFilter: true,
        enableGlobalFilter: true,
        enableResizing: true,
        enableHiding: true,
      }),
      columnHelper.accessor('created_at', {
        header: 'Ngày đăng ký',
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor('is_active', {
        id: 'is_active',
        header: 'Trạng thái',
        enableHiding: true,
        cell: ({ getValue }) => {
          const value = getValue()

          const badgeHelper: {
            icon: IconProps['name']
            text: string
            color: `var(--${'success' | 'muted-foreground'})`
          } = value
            ? {
                icon: 'CircleCheckBig',
                text: 'Đang hoạt động',
                color: 'var(--success)',
              }
            : {
                icon: 'Lock',
                text: 'Tạm khóa',
                color: 'var(--muted-foreground)',
              }

          return (
            <Badge
              variant="outline"
              className="justify-center gap-x-2 rounded-l-full rounded-r-full whitespace-nowrap"
            >
              <Icon
                aria-current={value}
                name={badgeHelper?.icon as IconProps['name']}
                stroke={badgeHelper?.color}
              />
              {badgeHelper?.text}
            </Badge>
          )
        },
        enableSorting: true,
        enableColumnFilter: true,
        enableGlobalFilter: true,
        enableResizing: true,
      }),
      columnHelper.display({
        id: ROW_ACTIONS_COLUMN_ID,
        meta: { align: 'center' },
        size: 60,
        maxSize: 60,
        enableHiding: false,
        cell: UserActionDropdown,
      }),
    ],
    []
  )

  return (
    <DataGrid
      columns={columns}
      data={data}
      loading={isLoading}
      border="bottom-only"
      defaultFilterOpen={false}
      containerProps={{
        style: { height: 'calc(var(--outlet-wrapper-height, 500px) - 9rem)' },
      }}
      virtualizerOptions={{ estimateSize: 48 }}
      toolbarProps={{
        override: true,
        render: UserTableToolbar,
      }}
    />
  )
}

export default UserTable
