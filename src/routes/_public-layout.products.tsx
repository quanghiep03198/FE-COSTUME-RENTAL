import { getCategoriesQueryOptions } from '@/apis/category/hooks/use-category-request'
import { getCostumesQueryOptions } from '@/apis/costume/hooks/use-costume-request'
import { getPropsQueryOptions } from '@/apis/equipment-props/hooks/use-equipment-props-request'
import { searchProductSchema } from '@/apis/product/schemas/product.schema'
import ProductPage from '@/components/blocks/products'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public-layout/products')({
  component: ProductPage,
  validateSearch: searchProductSchema,
  loader: async ({ context }) => {
    return await Promise.all([
      context.queryClient.ensureQueryData(getCategoriesQueryOptions()),
      context.queryClient.ensureQueryData(getCostumesQueryOptions()),
      context.queryClient.ensureQueryData(getPropsQueryOptions()),
    ])
  },
})
