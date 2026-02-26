import { Metrix, Mile, Referral } from '@/assets'

const EARN_CARDS = [
  {
    icon: Referral,
    title: 'Direct Referral Rewards',
    description:
      'Earn a fixed reward for every qualified member you introduce to the platform.',
    points: [
      'Instant referral credit',
      'Transparent tracking in referral page.',
      'Unlimited referral potential',
    ],
  },
  {
    icon: Metrix,
    title: 'Matrix Growth & Level Upgrades',
    description:
      'Grow your 2×2 structure and complete levels to unlock higher earning tiers.',
    points: [
      'Automatic level progression',
      'Upgrade-triggered rewards',
      'Increasing earning potential per level',
    ],
  },
  {
    icon: Mile,
    title: 'Milestone & Tier Bonuses',
    description:
      'Reach defined referral milestones and unlock additional performance bonuses.',
    points: [
      'Tier-based incentives',
      'Extra reward multipliers',
      'Recognition for top contributors',
    ],
  },
]

export function HowMembersEarn() {
  return (
    <section
      id="how-to-earn"
      className="w-full bg-[#F3F6F9] px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="container mx-auto">
        <h2 className="text-4xl sm:text-5xl font-semibold text-[#19415A] text-center mb-12">
          How Members Earn
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {EARN_CARDS.map(({ icon: Icon, title, description, points }) => (
            <div
              key={title}
              className="rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300 bg-white border-2 border-transparent"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#149AEE'
                e.currentTarget.style.boxShadow =
                  '0 20px 30px 0px rgba(20, 154, 238, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.boxShadow = ''
              }}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-7 h-7" strokeWidth={1.5} />
                <h3 className="text-[#19415A] text-base font-bold leading-snug">
                  {title}
                </h3>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed">
                {description}
              </p>

              <ul className="flex flex-col gap-2 mt-1">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#149AEE] shrink-0" />
                    <span className="text-[#008FE9] text-sm font-medium">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
