import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { MeritLogo } from '@/assets'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'How to earn', href: '#how-to-earn' },
]

export function NavHeader() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleScroll = (href: string) => {
    setMobileOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5">
      <nav className="mx-auto container bg-white rounded-lg border border-white/80 px-5 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={() => handleScroll('#home')}
          className="flex items-center gap-2 shrink-0"
        >
          <MeritLogo className="h-6 w-6 sm:h-8 sm:w-8 text-[#008FE9]" />
          <span className="text-[#149AEE] font-medium text-lg tracking-tight">
            Merit Finance
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleScroll(link.href)}
              className="text-[#008FE9] hover:text-[#149AEE] text-sm font-medium transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate({ to: '/login' })}
            className="px-5 py-2 text-sm font-medium text-[#008FE9] border border-[#008FE9] cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => navigate({ to: '/signup' })}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#149AEE] hover:bg-[#0B7FD4] rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>

        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="max-w-5xl mx-auto mt-2 bg-white rounded-2xl shadow-sm border border-white/80 px-5 py-4 flex flex-col gap-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleScroll(link.href)}
              className="text-left text-gray-600 hover:text-[#149AEE] text-sm font-medium py-1.5 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => {
                setMobileOpen(false)
                navigate({ to: '/login' })
              }}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => {
                setMobileOpen(false)
                navigate({ to: '/signup' })
              }}
              className="flex-1 px-4 py-2.5 text-sm font-medium cursor-pointer text-white bg-[#008FE9] hover:bg-[#0B7FD4] rounded-lg transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
