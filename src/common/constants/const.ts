import type { IconProps } from '@/components/ui/icon'

export const STATUS_OPTIONS: Array<{
  label: string
  value: boolean
  icon: IconProps['name']
}> = [
  {
    label: 'Đang hoạt động',
    value: true,
    icon: 'CircleCheck',
  },
  {
    label: 'Tạm khóa',
    value: false,
    icon: 'CircleMinus',
  },
]
