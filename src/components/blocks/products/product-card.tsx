import type { TProduct } from '@/apis/product/types'
import { formatCurrency } from '@/common/helpers/format-intl'
import Image from '@/components/shared/image'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@tanstack/react-router'

const ProductCard: React.FC<{ data: TProduct }> = ({ data }) => {
  return (
    <Card>
      <Image src={data.image} />
      <CardHeader>
        <CardDescription>{data.name}</CardDescription>
        <CardTitle>{formatCurrency(data.price)}</CardTitle>
      </CardHeader>
      <CardFooter>
        <Link to="/products/$type/$slug" params={{ type: data.type, slug: data.slug }} className="w-full">
          Chi tiết sản phẩm
        </Link>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
