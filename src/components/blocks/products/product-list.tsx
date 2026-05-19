import { useGetCostumesQuery } from '@/apis/costume/hooks/use-costume-request'
import { useGetPropsQuery } from '@/apis/equipment-props/hooks/use-equipment-props-request'
import { ItemType } from '@/common/constants/enums'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Typography } from '@/components/ui/typography'
import { useSearch } from '@tanstack/react-router'
import { useMemo } from 'react'

type Props = {}

const ProductList = () => {
  const search = useSearch({ from: '/_public-layout/products' })
  const { data: costumes } = useGetCostumesQuery()
  const { data: equipmentProps } = useGetPropsQuery()

  const dataSet = {
    [ItemType.COSTUMES]: costumes,
    [ItemType.EQUIPMENT_PROPS]: equipmentProps,
  }

  const products = useMemo(() => {
    const data = dataSet[search['item_type']]
    if (!Array.isArray(data)) return []

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.images[0]?.dest || '',
      price: item.rental_price_per_day,
      slug: item.slug,
      hashtags: item.hashtags,
    }))
  }, [search['item_type'], costumes, equipmentProps])

  return (
    <section>
      <div className="flex items-center justify-between">
        <Typography color="muted">{products.length}</Typography>
        <DropdownMenu>
          <DropdownMenuTrigger></DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </section>
  )
}

export default ProductList
