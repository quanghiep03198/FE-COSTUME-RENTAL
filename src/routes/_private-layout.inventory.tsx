import CostumePage from '@/components/blocks/costumes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-layout/inventory')({
  component: CostumePage,
})
