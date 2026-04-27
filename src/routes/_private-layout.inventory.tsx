import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-layout/inventory')({
  component: () => <div className="text-blue-500 bg-blue-50 h-screen">Hello</div>,
})
