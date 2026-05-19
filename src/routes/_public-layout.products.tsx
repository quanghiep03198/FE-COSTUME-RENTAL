import { searchProductSchema } from '@/apis/product/schemas/product.schema'
import ProductPage from '@/components/blocks/products'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public-layout/products')({
  component: ProductPage,
  validateSearch: searchProductSchema,
})
