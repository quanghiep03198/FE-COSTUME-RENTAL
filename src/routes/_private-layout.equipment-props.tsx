import { getPropsQueryOptions } from '@/apis/equipment-props/hooks/use-equipment-props-request'
import EquipmentPropsPage from '@/components/blocks/equipment-props'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-layout/equipment-props')({
  component: EquipmentPropsPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getPropsQueryOptions())
  },
})
