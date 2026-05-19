import { searchProductSchema } from '@/apis/product/product.schema'
import ProductPage from '@/components/blocks/products'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public-layout/san-pham')({
  component: ProductPage,
  validateSearch: searchProductSchema,
})
