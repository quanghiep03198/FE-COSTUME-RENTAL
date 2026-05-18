import { useGetCategoriesQuery } from '@/apis/category/hooks/use-category-request'
import { FaceBookIcon } from '@/assets/svg/facebook-icon'
import { InstagramIcon } from '@/assets/svg/instagram-icon'
import { ITEM_TYPE_MAP } from '@/common/constants/const'
import type { ItemType } from '@/common/constants/enums'
import { buttonVariants } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Typography } from '@/components/ui/typography'
import { Link } from '@tanstack/react-router'
import { groupBy } from 'lodash-es'
import { ArrowUpRightIcon, FilesIcon, HomeIcon } from 'lucide-react'
import React, { useMemo } from 'react'
import { SearchDialog } from './search-dialog'

const Header: React.FC = () => {
  const { data: categories } = useGetCategoriesQuery()

  const categoryGroups = useMemo(() => {
    if (!Array.isArray(categories)) return []
    return Object.entries(groupBy(categories, (item) => item.type)).map(([type, items]) => {
      return {
        id: type,
        label: ITEM_TYPE_MAP.get(type as ItemType)!.label,
        icon: ITEM_TYPE_MAP.get(type as ItemType)!.icon,
        items: items.map((item) => ({
          id: item.id,
          title: item.name,
          href: `/san-pham?danh-muc=${item.slug}`,
        })),
      }
    })
  }, [categories])

  return (
    <header className="border-b">
      {/* Top header nav */}
      <nav className="bg-accent text-accent-foreground p-2">
        <ul className="flex items-center container mx-auto">
          <li>
            <Link to="/" hash="thanh-toan" className={buttonVariants({ variant: 'link' })}>
              Thanh toán <ArrowUpRightIcon size={14} />
            </Link>
          </li>
          <li>
            <Link to="/" hash="chinh-sach" className={buttonVariants({ variant: 'link' })}>
              Chính sách <ArrowUpRightIcon size={14} />
            </Link>
          </li>
          <li>
            <Link to="/" hash="lien-he" className={buttonVariants({ variant: 'link' })}>
              Liên hệ <ArrowUpRightIcon size={14} />
            </Link>
          </li>

          <li className="ml-auto">
            <a
              href=""
              className={buttonVariants({
                variant: 'ghost',
                size: 'icon',
                className: 'hover:bg-primary [&:hover_svg]:stroke-primary-foreground',
              })}
            >
              <FaceBookIcon className="stroke-primary size-5" strokeWidth={2} />
            </a>
          </li>
          <li>
            <a
              href=""
              className={buttonVariants({
                variant: 'ghost',
                size: 'icon',
                className: 'hover:bg-primary [&:hover_svg]:stroke-primary-foreground',
              })}
            >
              <InstagramIcon className="stroke-primary size-5" strokeWidth={2} />
            </a>
          </li>
        </ul>
      </nav>
      {/* Main header nav */}
      <nav className="bg-primary text-primary-foreground">
        <div className="container mx-auto p-2 flex gap-4">
          <Link to="/" className="inline-flex items-center gap-1 hover:drop-shadow-[0_0_4px_var(--primary-foreground)]">
            <span className="font-medium">Diamond Studio</span>
          </Link>
          {/* Navigation menu */}
          <NavigationMenu className='[&_*[data-slot="navigation-menu-link"]]:hover:bg-accent [&_*[data-slot="navigation-menu-link"]]:hover:text-primary [&_*[data-slot="navigation-menu-trigger"]]:hover:bg-accent [&_*[data-slot="navigation-menu-trigger"]]:hover:text-primary'>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink render={<Link to="/" className="font-medium" />}>
                  <HomeIcon size={16} /> Trang chủ
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="gap-2">
                  <FilesIcon size={16} /> Danh mục
                </NavigationMenuTrigger>
                <NavigationMenuContent className="grid grid-cols-2 gap-10">
                  {categoryGroups.map((group) => (
                    <div className="space-y-3" key={group.id}>
                      <Typography variant="small" color="muted" className="inline-flex items-center gap-2 text-xs">
                        <Icon name={group.icon} />
                        {group.label}
                      </Typography>

                      <ul className="">
                        {group.items.map((item) => (
                          <li>
                            <NavigationMenuLink render={<Link to={item.href} />}>{item.title}</NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink render={<Link to="/" hash="san-pham-moi" className="font-medium" />}>
                  Sản phẩm mới
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink render={<Link to="/" hash="xu-huong" className="font-medium" />}>
                  Ưu đãi
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {/* Search command dialog */}
          <div className="flex flex-col gap-4 ml-auto">
            <SearchDialog />
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
