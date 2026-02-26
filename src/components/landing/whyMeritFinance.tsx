import {
  Automated,
  Calendar,
  Crypto,
  DashboardIcon,
  Structured,
  Transparent,
} from '@/assets'
import { useNavigate } from '@tanstack/react-router'

const FEATURES = [
  { icon: Structured, label: 'Structured 2×2 Matrix Model' },
  { icon: Transparent, label: 'Transparent Level System' },
  { icon: Calendar, label: 'Real-Time Activity Logs' },
  { icon: Crypto, label: 'Crypto-Based Payments' },
  { icon: Automated, label: 'Automated Upgrade Tracking' },
  { icon: DashboardIcon, label: 'Clean Dashboard & Monitoring Tools' },
]

export function WhyMeritFinance() {
  const navigate = useNavigate()

  return (
    <section className="w-full bg-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative rounded-3xl overflow-hidden px-10 py-14"
          style={{
            background: 'linear-gradient(135deg, #008FE9 0%, #1565C0 100%)',
          }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg
              viewBox="0 0 800 300"
              className="absolute bottom-0 left-0 w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0,200 C150,100 350,250 500,150 C650,50 750,180 800,120 L800,300 L0,300 Z"
                fill="white"
                opacity="0.3"
              />
              <path
                d="M0,240 C200,140 400,280 600,180 C700,130 750,200 800,160 L800,300 L0,300 Z"
                fill="white"
                opacity="0.2"
              />
            </svg>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl sm:text-5xl font-semibold text-white leading-tight">
                Why Merit Finance?
              </h2>
              <p className="text-white/80 text-md leading-relaxed max-w-sm">
                Continue upgrading to access higher levels and expanded rewards.
              </p>
              <button
                onClick={() => navigate({ to: '/signup' })}
                className="w-fit px-6 cursor-pointer py-3 bg-white text-[#1A8FE3] text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors"
              >
                Get Started
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div className="flex items-center gap-4 bg-[#228BED] border border-[#FFFFFF]/40 hover:bg-white/30 transition-colors rounded-2xl px-5 py-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <span className="text-white text-sm font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
