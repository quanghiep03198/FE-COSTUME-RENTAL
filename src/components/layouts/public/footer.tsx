import { contactInfo } from '@/assets/data/contact-us'
import { FaceBookIcon } from '@/assets/svg/facebook-icon'
import { InstagramIcon } from '@/assets/svg/instagram-icon'
import { buttonVariants } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Separator } from '@/components/ui/separator'
import { Link } from '@tanstack/react-router'
import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="grid lg:grid-cols-2 overflow-hidden mt-auto border-primary">
      {/* Footer main */}
      <div className="space-y-6 bg-primary text-primary-foreground xl:p-10 xxl:p-16 lg:p-6 p-4">
        <div className="space-y-6 mb-12!">
          <h1 className="text-3xl font-semibold font-serif">Diamond Studio</h1>
          <p className="text-sm text-input">
            Tôn vinh bản sắc văn hóa Việt Nam qua từng bộ sưu tập áo dài độc đáo và chất lượng hàng đầu. Hãy để chúng
            tôi giúp bạn tỏa sáng và thể hiện bản sắc riêng của mình qua những thiết kế áo dài tinh tế và đẳng cấp.
          </p>
        </div>
        {/* Contact */}
        <ul className="grid xl:grid-cols-2 gap-x-4 gap-y-1 text-sm mb-16!">
          {contactInfo.map((info) => (
            <li key={info.title} className="flex items-center gap-x-2">
              <Icon name={info.icon} /> {info.description}
            </li>
          ))}
        </ul>
        <Separator />
        {/* Navigation */}
        <nav>
          <ul className="flex items-center gap-x-2">
            <li>
              <Link
                to="/"
                className={buttonVariants({ variant: 'link', className: 'text-input! hover:text-primary-foreground!' })}
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className={buttonVariants({ variant: 'link', className: 'text-input! hover:text-primary-foreground!' })}
              >
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link
                to="/"
                hash="about-us"
                className={buttonVariants({ variant: 'link', className: 'text-input! hover:text-primary-foreground!' })}
              >
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className={buttonVariants({ variant: 'link', className: 'text-input! hover:text-primary-foreground!' })}
              >
                Liên hệ
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className={buttonVariants({ variant: 'link', className: 'text-input! hover:text-primary-foreground!' })}
              >
                Chính sách
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className={buttonVariants({ variant: 'link', className: 'text-input! hover:text-primary-foreground!' })}
              >
                Đăng nhập
              </Link>
            </li>
          </ul>
        </nav>
        <Separator />
        {/* Copyright & Social */}
        <div className="flex items-center">
          <small>© Copyright 2026, Diamond Studio</small>
          <ul className="ml-auto flex itmes-center">
            <li>
              <a
                href=""
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'icon',
                  className: 'hover:bg-primary [&:hover_svg]:stroke-primary-foreground',
                })}
              >
                <FaceBookIcon className="size-5" strokeWidth={2} />
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
                <InstagramIcon className="size-5" strokeWidth={2} />
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* Footer image */}
      <div className="lg:block bg-[url(/footer-img.jpg)] relative bg-bottom bg-cover bg-no-repeat hidden h-full w-full">
        <div className="bg-white/30 backdrop-sepia-[2] inset-0 absolute" />
      </div>
    </footer>
  )
}

export default Footer
