import { NavHeader } from '@/components/landing/navHeader'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <>
      <div className="min-h-screen bg-[#F3F6F9]">
        <NavHeader />
      </div>
    </>
  )
}
