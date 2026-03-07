import { useNavigate } from '@tanstack/react-router'
import linestyling from '../../assets/svgs/lineStyling.svg'
import { SuccessIcon } from '@/assets/svgs'
import { Speed, Upgrade, Withdraw } from '@/assets'

const TRUST_AVATARS = [
  'https://i.pravatar.cc/40?img=11',
  'https://i.pravatar.cc/40?img=32',
  'https://i.pravatar.cc/40?img=47',
  'https://i.pravatar.cc/40?img=58',
]

const STATS = [
  { label: 'Starting with just $23' },
  { label: '$5k+ balance at level 4' },
  { label: 'Withdraw anytime' },
  { label: '24/7 support' },
]

export function Hero() {
  const navigate = useNavigate()

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-8"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-8 items-start">
          <div className="hidden lg:flex flex-col gap-6 items-start pt-28">
            <div className="bg-white ml-6 rounded-2xl shadow-md border border-gray-100 px-4 py-3 flex items-start gap-3 w-72">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                <SuccessIcon />
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-gray-900 text-xs font-semibold">
                    Successful
                  </p>
                  <span className="text-gray-400 text-[10px]">2 min</span>
                </div>
                <p className="text-gray-400 text-[11px] mt-0.5 leading-relaxed">
                  Your wallet has been credited with $20 from your upline
                </p>
              </div>
            </div>

            <div className="bg-white p-6 ml-6 rounded-2xl shadow-lg border border-gray-100">
              <img
                src={linestyling}
                alt="line-styling"
                className="w-56 h-auto"
              />
            </div>
          </div>

          <div className="flex flex-col items-center text-center px-2">
            <h1 className="text-4xl sm:text-5xl font-semibold text-[#19415A] leading-tight tracking-tight">
              Empowering Structured
              <br />
              Digital <span className="text-[#0185D7]">Growth</span>
            </h1>

            <p className="mt-5 text-[#71808E] text-base leading-relaxed max-w-xl">
              A transparent digital membership platform designed to reward
              participation, team building, and structured progression.
            </p>

            <div className="flex flex-row items-center gap-3 mt-8">
              <button
                onClick={() => {
                  document
                    .querySelector('#how-it-works')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-6 py-3 text-sm font-semibold text-[#008FE9] border-2 border-[#149AEE] rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                View How It Works
              </button>
              <button
                onClick={() => navigate({ to: '/signup' })}
                className="px-6 py-3 text-sm font-semibold text-white bg-[#008FE9] hover:bg-[#0B7FD4] rounded-xl transition-colors shadow-md shadow-blue-200 whitespace-nowrap"
              >
                Get Started
              </button>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <div className="flex -space-x-2.5">
                {TRUST_AVATARS.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="user"
                    className="w-9 h-9 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <p className="text-gray-500 text-sm font-medium">
                Already Trusted by thousands
              </p>
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-4 items-end pt-28">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 w-85">
              <p className="text-gray-400 text-xs mb-1">Referral Earnings</p>
              <p className="text-gray-900 text-2xl font-bold">$14.12</p>
              <button className="mt-2 text-[#008FE9] text-xs border border-[#149AEE]/30 font-medium rounded-full px-3 py-1 hover:bg-blue-50 transition-colors">
                Refer friends to earn more
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg item-start border border-gray-100 p-5 w-75">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Current Balance</p>
                  <p className="text-gray-600 text-3xl font-bold">$54.12</p>
                </div>
                <div className="flex flex-col gap-2 mt-1 shrink-0">
                  <button className="flex items-center gap-2 text-sm font-semibold border-2 border-[#149AEE]/50 rounded-full px-3 py-1.5 text-[#008FE9] hover:bg-blue-50 transition-colors whitespace-nowrap">
                    Withdraw
                    <Withdraw className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-2 text-xs font-semibold border-2 border-[#149AEE]/50 rounded-full px-3 py-1.5 text-[#008FE9] hover:bg-blue-50 transition-colors whitespace-nowrap">
                    Upgrade
                    <Upgrade className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex border border-gray-300 p-3 rounded-full items-center gap-2"
            >
              <div className="w-5 h-5 rounded-full bg-[#008FE9]/15 flex items-center justify-center shrink-0">
                <Speed className="w-4 h-4" />
              </div>
              <span className="text-gray-700 text-sm font-semibold">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
