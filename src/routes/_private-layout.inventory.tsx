import CostumePage from '@/components/blocks/costumes/costume-item'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-layout/inventory')({
  component: CostumePage,
})
