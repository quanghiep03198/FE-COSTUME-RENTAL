import { stats } from '@/assets/data/about-us'
import { contactInfo } from '@/assets/data/contact-us'
import { testimonials } from '@/assets/data/testimoials'
import AboutUs from '@/components/blocks/home/about-us'
import BentoGridHero from '@/components/blocks/home/bento-grid-hero'
import ContactUs from '@/components/blocks/home/contact-us'
import HeroBanner from '@/components/blocks/home/hero-banner'
import Testimonials from '@/components/blocks/home/testimotials'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public-layout/')({
  component: App,
})

function App() {
  return (
    <div className="space-y-10 ">
      <HeroBanner />
      <BentoGridHero />
      <AboutUs stats={stats} />
      <Testimonials testimonials={testimonials} />
      <ContactUs contactInfo={contactInfo} />
    </div>
  )
}
