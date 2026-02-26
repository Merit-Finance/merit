import { Level, Reward, Team, Track } from '@/assets'

const FEATURES = [
  {
    icon: Level,
    label: 'Clear level progression',
  },
  {
    icon: Team,
    label: 'Structured team expansion',
  },
  {
    icon: Reward,
    label: 'Automated reward distribution',
  },
  {
    icon: Track,
    label: 'Transparent activity tracking',
  },
]

export function WhatIsMeritFinance() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className=" flex flex-col items-center text-center">
        <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 mb-8 bg-white shadow-sm">
          <img
            src="/favicon.svg"
            alt="Merit Finance"
            className="h-6 w-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <span className="text-gray-700 text-sm font-medium">
            What is Merit Finance?
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-semibold text-[#19415A] leading-tight">
          Smart. Structured.
          <br />
          Reward-Driven.
        </h2>

        <p className="mt-6 text-gray-400 text-md leading-relaxed max-w-3xl">
          Merit Finance is a digital membership platform that operates on a
          structured matrix model. Members progress through defined levels,
          unlock earning opportunities, and participate in a transparent reward
          system powered by cryptocurrency.
        </p>

        <p className="mt-12 text-gray-800 text-sm font-semibold">
          Our system is built to ensure
        </p>
      </div>

      <div className="mt-6 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 border border-gray-100 rounded-2xl px-4 py-3.5 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#149AEE] to-[#0B7FD4] flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-[#149AEE] text-sm font-semibold leading-snug">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
