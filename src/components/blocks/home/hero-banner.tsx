import { buttonVariants } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

const HeroBanner: React.FC = () => {
  return (
    <section className="relative text-primary-foreground w-full h-auto">
      <div className="grid place-content-center absolute inset-0 bg-radial from-black/50 to-black/75">
        <div className="flex flex-col gap-3 text-center items-center">
          <Link
            to="/"
            className={buttonVariants({
              variant: 'outline',
              size: 'sm',
              className:
                'bg-transparent rounded-r-full rounded-l-full border-white mb-6 animate-in fade-in-0 slide-in-from-bottom-100 zoom-in-90 duration-500',
            })}
          >
            Khám phá bộ sưu tập <ArrowRightIcon className="size-3" />
          </Link>

          <h1 className="text-5xl font-bold text-white blur-in-lg animate-in fade-in-0 slide-in-from-bottom-50 ease-out duration-500">
            Gói Trọn Nét Thơ - Tôn Vinh Bản Sắc
          </h1>
          <p className=" text-lg text-white animate-in blur-in-lg fade-in-0 slide-in-from-bottom-50 ease-out duration-700">
            Cho thuê áo dài thiết kế và trang phục truyền thống cao cấp. Sắc sảo từng đường kim, chuẩn phom tôn dáng.
          </p>

          <div className="flex justify-center items-center gap-2 mt-6 animate-in fade-in-0 slide-in-from-bottom-100 zoom-in-95 duration-500">
            <Link to="/san-pham" className={buttonVariants({ size: 'lg', effect: 'glass' })}>
              Cửa hàng
            </Link>
            <Link to="/" hash="" className={buttonVariants({ variant: 'link', className: 'text-white' })}>
              Khám phá <ArrowRightIcon className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      <img src="/hero-banner.jpg" className="w-full h-150 xxl:h-[90vh] object-cover -z-10" />
    </section>
  )
}

export default HeroBanner
