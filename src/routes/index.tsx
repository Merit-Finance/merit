import { Footer } from '@/components/landing/footer'
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/howItWorks'
import { HowMembersEarn } from '@/components/landing/howMembersEarn'
import { NavHeader } from '@/components/landing/navHeader'
import { WhatIsMeritFinance } from '@/components/landing/whatIsMeritFinance'
import { WhyMeritFinance } from '@/components/landing/whyMeritFinance'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <>
      <div className="min-h-screen  bg-[#F3F6F9]">
        <NavHeader />
        <Hero />
        <WhatIsMeritFinance />
        <HowMembersEarn />
        <HowItWorks />
        <WhyMeritFinance />
        <Footer />
      </div>
    </>
  )
}
