import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Rating } from '@/components/ui/rating'
import type React from 'react'

export type TestimonialItem = {
  name: string
  avatar: string
  rating: number
  content: string
}

type TestimonialsProps = {
  testimonials: TestimonialItem[]
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  return (
    <section
      id="testimonials"
      className="before:border-primary/20 relative py-14 before:absolute before:inset-0 before:-z-10 before:-skew-y-3 before:border-b sm:py-28 lg:py-36"
    >
      <Carousel
        className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:items-center sm:gap-6 sm:px-6 lg:flex-row lg:gap-24 lg:px-8"
        opts={{
          align: 'start',
          slidesToScroll: 1,
        }}
      >
        {/* Left Content */}
        <div className="w-full space-y-4 lg:w-1/3">
          <Badge variant="outline" className="text-sm font-normal">
            Khách hàng nói gì
          </Badge>

          <h2 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">Phản hồi từ khách hàng</h2>

          <p className="text-muted-foreground text-xl">
            Chúng tôi tự hào về sự hài lòng của khách hàng và luôn nỗ lực để mang đến trải nghiệm thuê áo dài tốt nhất.
          </p>

          <div className="flex items-center gap-4">
            <CarouselPrevious
              variant="default"
              className="disabled:bg-primary/10 disabled:text-primary static size-9 translate-y-0 rounded-full disabled:opacity-100"
            />
            <CarouselNext
              variant="default"
              className="disabled:bg-primary/10 disabled:text-primary static size-9 translate-y-0 rounded-full disabled:opacity-100"
            />
          </div>
        </div>

        {/* Right Testimonial Carousel */}
        <div className="relative w-full max-w-196 lg:w-2/3">
          <CarouselContent className="sm:-ml-6">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="sm:pl-6 lg:basis-1/2">
                <Card className="hover:border-primary h-full rounded-none transition-colors duration-300">
                  <CardContent className="space-y-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10 rounded-full">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback className="rounded-full text-sm">
                          {testimonial.name
                            .split(' ', 2)
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h4 className="font-medium">{testimonial.name}</h4>
                      </div>
                    </div>

                    <Rating readOnly variant="yellow" size={24} value={testimonial.rating} precision={0.5} />
                    <p>{testimonial.content}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </Carousel>
    </section>
  )
}

export default Testimonials
