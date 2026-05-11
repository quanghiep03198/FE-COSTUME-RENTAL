import useAuth from '@/apis/auth/hooks/use-auth-request'
import { useGetImagesQuery } from '@/apis/image/hooks/use-image-request'
import type { IImage } from '@/apis/image/types'
import { getImageUrl } from '@/common/helpers/get-image-url'
import { DataGrid } from '@/components/shared/data-grid'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import generateAvatar from '@/lib/generate-avatar'
import { createColumnHelper } from '@tanstack/react-table'
import { filesize } from 'filesize'
import { useMemo } from 'react'
import ImageActionsDropdown from './image-action-dropdown'
import ImageDialog from './image-dialog'

const ImageGalleryTable: React.FC = () => {
  const { data, isLoading } = useGetImagesQuery()
  const { user } = useAuth()

  const columnHelper = createColumnHelper<IImage>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('file_name', {
        header: 'File',
        enableSorting: true,
        enableColumnFilter: true,
        enableGlobalFilter: true,
        cell: ({ row }) => (
          <Item size="xs" className="p-0 flex-nowrap">
            <ItemMedia variant={'icon'}>
              <img
                src={getImageUrl(row.original.dest)}
                className="size-14 rounded-lg object-cover object-center"
                loading="lazy"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="hover:underline">
                <ImageDialog {...row.original} />
              </ItemTitle>
            </ItemContent>
          </Item>
        ),
      }),
      columnHelper.accessor('mime_type', {
        header: 'Định dạng',
        enableColumnFilter: true,
        enableSorting: true,
        filterFn: 'equalsString',
      }),
      columnHelper.accessor('category.slug', {
        header: 'Danh mục',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => row.original.category.name,
      }),
      columnHelper.accessor('size', {
        header: 'Kích thước',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ getValue }) => filesize(getValue()),
      }),
      columnHelper.accessor('created_by', {
        header: 'Tải lên bởi',
        enableColumnFilter: true,
        enableSorting: true,
        enableGlobalFilter: true,
        size: 200,
        sortingFn: 'alphanumericCaseSensitive',
        cell: ({ getValue }) => {
          const owner = getValue()
          if (!owner) return 'Chưa xác định'

          return (
            <Item size="xs" className="p-0">
              <ItemMedia>
                <Avatar>
                  <AvatarImage src={generateAvatar({ name: owner.employee.full_name })} />
                  <AvatarFallback>{owner.employee.full_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  {owner.employee.full_name} {user?.id === owner.id && '(Bạn)'}
                </ItemTitle>
                <ItemDescription>{owner.email}</ItemDescription>
              </ItemContent>
            </Item>
          )
        },
      }),
      columnHelper.accessor('created_at', {
        header: 'Ngày tải lên',
        enableColumnFilter: true,
        enableSorting: true,
        sortingFn: 'datetime',
        filterFn: 'inDateRange',
        cell: (info: any) =>
          new Date(info.getValue()).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Thao tác',
        cell: ImageActionsDropdown,
        enableColumnFilter: false,
        enableSorting: false,
        enableGlobalFilter: false,
        enableResizing: false,
        size: 100,
      }),
    ],
    []
  )

  return (
    <DataGrid
      columns={columns}
      data={data}
      loading={isLoading}
      toolbarProps={{ override: true, render: () => null }}
      containerProps={{
        className: 'border-none h-[calc(100vh-14rem)]',
      }}
    />
  )
}

export default ImageGalleryTable
