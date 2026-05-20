import { useGetProductDetailQuery } from '@/apis/product/hooks/use-product-request'
import type { IProduct } from '@/apis/product/types'
import { formatCurrency } from '@/common/helpers/format-intl'
import Image from '@/components/shared/image'
import { Badge } from '@/components/ui/badge'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'
import React, { Suspense, useCallback, useEffect, useState } from 'react'

const ProductDetailPage: React.FC = () => {
  const productDetailQuery = useGetProductDetailQuery()

  const [mainApi, setMainApi] = useState<CarouselApi>()
  const [thumbApi, setThumbApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const data = productDetailQuery?.data as IProduct | undefined

  useEffect(() => {
    if (!mainApi) {
      return
    }

    setCurrent(mainApi.selectedScrollSnap())
    mainApi.on('select', () => {
      const selectedIndex = mainApi.selectedScrollSnap()

      setCurrent(selectedIndex)

      // Sync all carousels with main carousel
      thumbApi?.scrollTo(selectedIndex)
    })
  }, [mainApi, thumbApi])

  useEffect(() => {
    if (!thumbApi) {
      return
    }

    thumbApi.on('select', () => {
      const selectedIndex = thumbApi.selectedScrollSnap()

      setCurrent(selectedIndex)

      mainApi?.scrollTo(selectedIndex)
    })
  }, [thumbApi, mainApi])

  const handleThumbClick = useCallback(
    (index: number) => {
      mainApi?.scrollTo(index)
    },
    [mainApi]
  )

  // const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }))

  return (
    <div className="container mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-10 p-2 md:p-6">
      <Suspense fallback={<FallbackDetail />}>
        {/* Product image slider */}
        <div className="space-y-3">
          <Carousel
            className="w-full lg:col-span-2"
            setApi={setMainApi}
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {Array.isArray(productDetailQuery?.data?.images) &&
                productDetailQuery.data.images.map((item) => (
                  <CarouselItem key={item.id} className="flex w-full items-center justify-center">
                    <Image src={item.url} alt={item.file_name} className="size-120 rounded object-cover object-top" />
                  </CarouselItem>
                ))}
            </CarouselContent>
          </Carousel>
          <Carousel
            className="relative w-full max-lg:order-2 lg:col-span-3"
            setApi={setThumbApi}
            opts={{
              loop: true,
            }}
          >
            <div className="from-background pointer-events-none absolute inset-y-0 left-0 z-1 w-25 bg-linear-to-r via-85% to-transparent" />
            <div className="from-background pointer-events-none absolute inset-y-0 right-0 z-1 w-25 bg-linear-to-l via-85% to-transparent" />
            <CarouselContent className="flex">
              {Array.isArray(data?.images) &&
                data?.images.map((item, index) => (
                  <CarouselItem
                    key={item.id}
                    className={cn('basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/3 xl:basis-1/4')}
                    onClick={() => handleThumbClick(index)}
                  >
                    <img src={item?.url} alt={item.file_name} className="size-25 object-cover object-top rounded" />
                  </CarouselItem>
                ))}
            </CarouselContent>
          </Carousel>
        </div>
        {/* Product information */}
        <div className="space-y-4">
          <Typography as="h1" variant="h2" color="primary">
            {data?.name}
          </Typography>
          <Typography variant="h4">{formatCurrency(data?.rental_price_per_day!)}</Typography>
          <div className="flex items-center gap-2">
            {Array.isArray(data?.inventory.by_size) &&
              data.inventory.by_size.map((size) => (
                <Badge
                  variant="outline"
                  aria-disabled={!size.is_available}
                  className=" aria-disabled:bg-muted aria-disabeld:text-muted-foreground relative aria-disabled:line-through "
                >
                  {size.size}
                </Badge>
              ))}
          </div>
          {data?.description && (
            <div
              className="mt-10 space-y-3 text-sm [&_table]:mb-6 [&_table_th]:text-left prose-h3:text-lg [&_table]:text-foreground"
              dangerouslySetInnerHTML={{ __html: data?.description }}
            />
          )}
        </div>
      </Suspense>
    </div>
  )
}

const FallbackDetail: React.FC = () => {
  return (
    <>
      <div className="space-y-3">
        <Skeleton className="aspect-square w-full rounded size-95" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="aspect-square w-full rounded size-30" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="w-1/2 h-8 rounded" />
        <Skeleton className="w-1/4 h-6 rounded" />
      </div>
    </>
  )
}

export default ProductDetailPage
