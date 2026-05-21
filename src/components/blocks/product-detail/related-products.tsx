import { getOneCategoryQueryOptions } from '@/apis/category/hooks/use-category-request'
import type { ICategory } from '@/apis/category/types'
import { ItemType } from '@/common/constants/enums'
import { buttonVariants } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, PackageSearchIcon } from 'lucide-react'
import { Suspense } from 'react'
import ProductCard from '../products/product-card'

const RelatedProducts: React.FC<{ category: ICategory }> = ({ category }) => {
  const { data } = useSuspenseQuery(
    getOneCategoryQueryOptions(category.id, category.type === ItemType.COSTUME ? 'costumes' : 'equipment_props')
  )

  return (
    <Suspense>
      <div className="space-y-6">
        <Typography variant="h2">Có thể bạn quan tâm</Typography>
        {!Array.isArray(data.products) || data.products.length === 0 ? (
          <Empty className="border border-dashed">
            <EmptyMedia variant="icon">
              <PackageSearchIcon />
            </EmptyMedia>
            <EmptyHeader className="max-w-xl">
              <EmptyTitle>Hiện tại chưa có sản phẩm nào trong danh mục này</EmptyTitle>
              <EmptyDescription>
                Hãy quay lại sau hoặc khám phá thêm nhiều sản phẩm khác tại trang chủ nhé!
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link to="/products" className={buttonVariants({ effect: 'glass' })}>
                Xem thêm <ArrowRightIcon />
              </Link>
            </EmptyContent>
          </Empty>
        ) : (
          <Carousel>
            <CarouselContent className="flex justify-center p-2">
              {data.products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className={cn(
                    'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/3 xl:basis-1/4 flex justify-center items-stretch'
                  )}
                >
                  <ProductCard
                    data={{ ...product, type: product?.category?.type!, image: product?.images?.[0]?.url! }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </Suspense>
  )
}

export default RelatedProducts
