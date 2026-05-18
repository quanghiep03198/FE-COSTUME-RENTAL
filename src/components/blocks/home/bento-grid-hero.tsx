import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import type React from 'react'

const BentoGridHero: React.FC = () => {
  return (
    <section className="xl:container xxl:p-0 px-4 mx-auto grid xl:grid-cols-3 gap-6 md:max-xl:grid-cols-2 grid-cols-1 grid-rows-2 [&_*[data-slot=card-title]]:text-white [&_*[data-slot=card-description]]:text-white">
      <Card className="col-start-1 xl:row-span-full p-0 relative lg:min-h-135 min-h-100">
        <img src="/ao-dai-thu-bao.jpg" className="w-full object-cover absolute inset-0 object-top z-0" />
        <CardContent className="flex flex-col items-start gap-y-1.5 relative z-10 mt-auto py-6 bg-linear-to-t from-[#00ad9695] to-75% to-transparent rounded-none">
          <CardTitle className="text-xl font-semibold">Áo dài Nữ</CardTitle>
          <CardDescription className="mb-3">
            Áo dài là trang phục truyền thống của Việt Nam, thường được mặc trong các dịp lễ hội, sự kiện quan trọng và
            cả trong cuộc sống hàng ngày.
          </CardDescription>
          <Link to="/san-pham" className={buttonVariants({ variant: 'secondary', effect: 'glass' })}>
            Xem thêm <ArrowRightIcon className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </CardContent>
      </Card>
      <Card className="xl:col-start-2 relative xl:row-span-full p-0 bg-primary/10 text-primary gap-0">
        <CardContent className="flex flex-col items-start gap-y-1.5 z-10 xl:bg-linear-to-b bg-linear-to-t mt-auto xl:mt-0 from-[#f4e8e3] to-50% to-transparent py-6 ">
          <CardTitle className="text-xl font-semibold">Áo dài Nam</CardTitle>
          <CardDescription className="mb-3">
            Áo dài nam thường có thiết kế đơn giản hơn so với áo dài nữ, nhưng vẫn giữ được sự trang trọng và lịch lãm.
          </CardDescription>
          <Link to="/san-pham" className={buttonVariants({ variant: 'secondary', effect: 'glass' })}>
            Xem thêm <ArrowRightIcon className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </CardContent>
        <img src="/ao-dai-gia-hy.jpg" className="w-full absolute inset-0 z-0 object-contain object-bottom " />
      </Card>
      <Card className="xl:col-start-3 sm:max-lg:col-span-full relative row-span-1 p-0 bg-primary/10 text-primary gap-0">
        <CardContent className="flex flex-col items-start gap-y-1.5 relative z-10 xl:bg-linear-to-b bg-linear-to-t mt-auto xl:mt-0 from-[#ef756695] to-75% to-transparent py-6 ">
          <CardTitle className="text-xl font-semibold">Phù hợp mọi dịp</CardTitle>
          <CardDescription className="mb-3">
            Sự linh hoạt này làm cho áo dài trở thành một phần quan trọng của văn hóa Việt Nam.
          </CardDescription>
          <Link to="/san-pham" className={buttonVariants({ variant: 'secondary', effect: 'glass' })}>
            Khám phá <ArrowRightIcon className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </CardContent>
        <img src="/ao-dai-mien-vu.jpg" className="w-full absolute inset-0 z-0 object-cover object-top" />
      </Card>
      <Card className="xl:col-start-3 sm:max-lg:col-span-full  md:max-lg:row-start-3 xl:row-start-2 row-span-1 p-0 relative">
        <CardContent className="flex flex-col items-start gap-y-1.5 from-[#252d3c] to-75% to-transparent xl:bg-linear-to-b bg-linear-to-t mt-auto xl:mt-0 py-6 relative z-10 text-primary-foreground">
          <CardTitle className="text-xl font-semibold">Đường may tinh tế</CardTitle>
          <CardDescription className="mb-3">
            Chất lượng đường may của áo dài rất quan trọng, đảm bảo sự thoải mái và độ bền của trang phục.
          </CardDescription>
          <Link to="/san-pham" className={buttonVariants({ variant: 'secondary', effect: 'glass' })}>
            Tìm hiểu <ArrowRightIcon className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </CardContent>
        <img
          src="/ao-ngu-than-ty-ba.jpg"
          className="w-full z-0  absolute inset-0 object-cover object-bottom xl:object-center h-full"
        />
      </Card>
    </section>
  )
}

export default BentoGridHero
