import { getCategoriesQueryOptions } from '@/apis/category/hooks/use-category-request'
import { stats } from '@/assets/data/about-us'
import { contactInfo } from '@/assets/data/contact-us'
import { testimonials } from '@/assets/data/testimoials'
import AboutUs from '@/components/blocks/home/about-us'
import ContactUs from '@/components/blocks/home/contact-us'
import HeroBanner from '@/components/blocks/home/hero-banner'
import Masonry from '@/components/blocks/home/masonry'
import Testimonials from '@/components/blocks/home/testimotials'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public-layout/')({
  component: HomePage,
  loader: async ({ context }) => {
    return await context.queryClient.ensureQueryData(getCategoriesQueryOptions())
  },
})

function HomePage() {
  return (
    <main className="space-y-16">
      <HeroBanner />
      <Masonry />
      <AboutUs stats={stats} />
      <Testimonials testimonials={testimonials} />
      <ContactUs contactInfo={contactInfo} />
    </main>
  )
}
