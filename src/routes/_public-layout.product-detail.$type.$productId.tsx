import { getCostumeDetailQueryOptions } from '@/apis/costume/hooks/use-costume-request'
import { getPropsDetailQueryOptions } from '@/apis/equipment-props/hooks/use-equipment-props-request'
import ProductDetailPage from '@/components/blocks/product-detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public-layout/product-detail/$type/$productId')({
  component: ProductDetailPage,
  params: {
    parse: (params: { type: string; productId: string }) => {
      return { type: params.type as 'costume' | 'equipment-props', productId: Number(params.productId) }
    },
    stringify: (params) => {
      return {
        ...params,
        productId: String(params.productId),
      }
    },
  },
  loader: async ({ context, params: { type, productId } }) => {
    if (type === 'costume') return await context.queryClient.ensureQueryData(getCostumeDetailQueryOptions(productId))
    if (type === 'equipment-props')
      return await context.queryClient.ensureQueryData(getPropsDetailQueryOptions(productId))
  },
})
