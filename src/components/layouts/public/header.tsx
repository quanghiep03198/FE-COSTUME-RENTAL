import { useGetCategoriesQuery } from '@/apis/category/hooks/use-category-request'
import { FaceBookIcon } from '@/assets/svg/facebook-icon'
import { InstagramIcon } from '@/assets/svg/instagram-icon'
import { ITEM_TYPE_MAP } from '@/common/constants/const'
import type { ItemType } from '@/common/constants/enums'
import { buttonVariants } from '@/components/ui/button'
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
import { ArrowUpRightIcon, GiftIcon, HomeIcon, NotepadTextIcon, ShoppingBagIcon, SparklesIcon } from 'lucide-react'
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
          href: `/products`,
          slug: item.slug,
        })),
      }
    })
  }, [categories])

  return (
    <header className="border-b sticky top-0 z-50">
      {/* Top header nav */}
      <nav className="bg-primary text-primary-foreground p-2">
        <ul className="flex items-center container mx-auto">
          <li>
            <Link
              to="/login"
              hash="thanh-toan"
              className={buttonVariants({ variant: 'link', size: 'sm', className: 'text-primary-foreground!' })}
            >
              Đăng nhập hệ thống <ArrowUpRightIcon size={14} />
            </Link>
          </li>
          <li>
            <Link
              to="/"
              hash="about-us"
              className={buttonVariants({ variant: 'link', size: 'sm', className: 'text-primary-foreground!' })}
            >
              Về chúng tôi <ArrowUpRightIcon size={14} />
            </Link>
          </li>
          <li>
            <Link
              to="/"
              hash="contact-us"
              className={buttonVariants({ variant: 'link', size: 'sm', className: 'text-primary-foreground!' })}
            >
              Liên hệ <ArrowUpRightIcon size={14} />
            </Link>
          </li>
          <li>
            <Link
              to="/policies"
              hash="chinh-sach"
              className={buttonVariants({ variant: 'link', size: 'sm', className: 'text-primary-foreground!' })}
            >
              Chính sách <ArrowUpRightIcon size={14} />
            </Link>
          </li>
          <li className="ml-auto">
            <a
              href="#"
              className={buttonVariants({
                variant: 'ghost',
                size: 'icon',
              })}
            >
              <FaceBookIcon className="size-5" strokeWidth={2} />
            </a>
          </li>
          <li>
            <a
              href="#"
              className={buttonVariants({
                variant: 'ghost',
                size: 'icon',
              })}
            >
              <InstagramIcon className="size-5" strokeWidth={2} />
            </a>
          </li>
        </ul>
      </nav>
      {/* Main header nav */}
      <nav className="bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto p-2 flex gap-4">
          <Link
            to="/"
            className="inline-flex px-2 items-center gap-1 hover:drop-shadow-[0_0_4px_var(--primary-foreground)]"
          >
            <span className="font-bold font-serif text-primary">Diamond Studio</span>
          </Link>
          {/* Navigation menu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink render={<Link to="/" className="font-medium" />}>
                  <HomeIcon size={16} /> Trang chủ
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="gap-2">
                  <NotepadTextIcon size={16} /> Danh mục
                </NavigationMenuTrigger>
                <NavigationMenuContent
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${categoryGroups.length}, 1fr)`,
                    gap: 24,
                    width: 'fit-content',
                  }}
                >
                  {categoryGroups.map((group) => (
                    <div className="space-y-3" key={group.id}>
                      <Typography variant="small" className="inline-flex items-center gap-2 font-medium px-2">
                        {group.label}
                      </Typography>

                      <ul>
                        {group.items.map((item) => (
                          <li>
                            <NavigationMenuLink
                              render={
                                <Link
                                  to={item.href}
                                  search={{ item_type: group.id as ItemType, 'category_slug:eq': item.slug }}
                                />
                              }
                              className="text-muted-foreground hover:text-primary"
                            >
                              {item.title}
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink render={<Link to="/products" className="font-medium" />}>
                  <SparklesIcon className="size-4" />
                  Sản phẩm
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink render={<Link to="/" hash="xu-huong" className="font-medium" />}>
                  <GiftIcon className="size-4" />
                  Ưu đãi
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {/* Search command dialog */}
          <div className="ml-auto flex items-center gap-2">
            <SearchDialog />
            <Link to="/" className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'relative' })}>
              <ShoppingBagIcon className="size-5" />
              <span className="absolute top-0 right-0 -translate-y-2 translate-x-2 size-5 inline-grid place-content-center text-center text-xs! rounded-full bg-destructive text-destructive-foreground">
                0
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
