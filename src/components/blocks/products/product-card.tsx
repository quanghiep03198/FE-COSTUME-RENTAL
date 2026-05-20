import { COSTUME_GENDER_LABEL_MAP } from '@/apis/costume/constants'
import type { IProduct } from '@/apis/product/types'
import { GENDER_ICONS } from '@/assets/svg/gender-icons'
import { ItemType } from '@/common/constants/enums'
import { formatCurrency } from '@/common/helpers/format-intl'
import Image from '@/components/shared/image'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Typography } from '@/components/ui/typography'
import { Link } from '@tanstack/react-router'
import { isNil } from 'lodash-es'

const ProductCard: React.FC<{
  data: Pick<IProduct, 'id' | 'name' | 'image' | 'type' | 'rental_price_per_day' | 'color' | 'gender' | 'sizes'>
}> = ({ data }) => {
  const gender = !isNil(data.gender)
    ? { icon: GENDER_ICONS.get(data.gender)!, label: COSTUME_GENDER_LABEL_MAP.get(data.gender)! }
    : null

  return (
    <Link
      className="space-y-3"
      to="/product-detail/$type/$productId"
      params={{
        type: data.type.toLowerCase().replaceAll('_', '-') as 'costume' | 'equipment-props',
        productId: data.id,
      }}
    >
      <Image src={data.image} className="aspect-square object-cover object-top w-full rounded" alt={data.image} />
      <div className="grid gap-1 auto-cols-auto">
        <Typography variant="small" color="muted" className="text-xs">
          {data.name}
        </Typography>
        <Typography as="span" className="font-medium">
          {formatCurrency(data.rental_price_per_day)}
        </Typography>
        {data.type === ItemType.COSTUME && gender && (
          <Badge variant="outline" className="col-start-2 row-start-1 place-self-end">
            <gender.icon />
            {gender.label}
          </Badge>
        )}
      </div>
      {data.type === ItemType.COSTUME && (
        <div className="flex gap-2 flex-wrap items-center">
          <div
            style={{
              width: 12,
              height: 12,
              outline: `1px solid ${data.color}`,
              outlineOffset: 2,
              borderRadius: '100%',
              backgroundColor: data.color,
            }}
          />
          <Separator orientation="vertical" />
          {Array.isArray(data.sizes) && (
            <div className="flex gap-1 flex-wrap">
              {data.sizes.map((size) => (
                <Badge key={size} variant="outline">
                  {size}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </Link>
  )
}

export default ProductCard
