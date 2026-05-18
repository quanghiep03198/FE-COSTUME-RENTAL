import SplitText from '@/components/animated/split-text'
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
              className:
                'bg-transparent rounded-r-full rounded-l-full border-white mb-6 animate-in fade-in-0 slide-in-from-bottom-100 zoom-in-75 duration-500 delay-100',
            })}
          >
            Khám phá bộ sưu tập <ArrowRightIcon className="size-3" />
          </Link>

          <SplitText
            tag="h1"
            text="Gói Trọn Nét Thơ – Tôn Vinh Bản Sắc"
            ease="power3.out"
            splitType="lines"
            className="text-5xl font-bold text-white"
            delay={0}
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
          />
          <SplitText
            text="Cho thuê áo dài thiết kế và trang phục truyền thống cao cấp. Sắc sảo từng đường kim, chuẩn phom tôn dáng."
            className="xxl:text-lg text-white"
            delay={5}
            duration={0.75}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0}
            tag="p"
            textAlign="center"
          />
          <div className="flex justify-center items-center gap-2 mt-6">
            <Link to="/san-pham" className={buttonVariants()}>
              Cửa hàng
            </Link>
            <Link to="/" hash="" className={buttonVariants({ variant: 'link', className: 'text-white' })}>
              Khám phá <ArrowRightIcon className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      <img src="/hero-banner.jpg" className="w-full h-135 xxl:h-[90vh] object-cover -z-10" />
    </section>
  )
}

export default HeroBanner
