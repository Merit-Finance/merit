import iphone1 from '../../assets/svgs/iphone1.svg'
import iphone2 from '../../assets/svgs/iphone2.svg'
import iphone3 from '../../assets/svgs/iphone3.svg'
import iphone4 from '../../assets/svgs/iphone4.svg'

const STEPS = [
  {
    title: 'Join the',
    highlight: 'Network',
    highlightFirst: false,
    description: 'Create your account and activate your first level.',
    image: iphone1,
    imageLeft: false,
    imageAnchor: 'bottom',
  },
  {
    title: 'Your Structure',
    highlight: 'Build',
    highlightFirst: true,
    description:
      'Invite members and grow your matrix through a 2×2 structured system.',
    image: iphone2,
    imageLeft: true,
    imageAnchor: 'top',
  },
  {
    title: 'Progress & Unlock',
    highlight: 'Rewards',
    highlightFirst: false,
    description:
      'As your structure fills, you advance levels and unlock new earning potential.',
    image: iphone3,
    imageLeft: false,
    imageAnchor: 'bottom',
  },
  {
    title: '& Scale',
    highlight: 'Upgrade',
    highlightFirst: true,
    description:
      'Continue upgrading to access higher levels and expanded rewards.',
    image: iphone4,
    imageLeft: true,
    imageAnchor: 'top',
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full bg-white px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-[#19415A] text-center mb-16">
          How It Works
        </h2>

        <div className="flex flex-col gap-16">
          {STEPS.map(
            ({
              title,
              highlight,
              highlightFirst,
              description,
              image,
              imageLeft,
              imageAnchor,
            }) => (
              <div
                key={highlight}
                className={`flex flex-col ${imageLeft ? 'sm:flex-row-reverse' : 'sm:flex-row'} items-center gap-10`}
              >
                {/* Text side */}
                <div className="w-full sm:flex-1 flex flex-col justify-center px-4">
                  <h3 className="text-2xl sm:text-4xl font-semibold text-[#19415A] leading-snug mb-3">
                    {highlightFirst ? (
                      <>
                        <span className="text-[#149AEE]">{highlight}</span>{' '}
                        {title}
                      </>
                    ) : (
                      <>
                        {title}{' '}
                        <span className="text-[#149AEE]">{highlight}</span>
                      </>
                    )}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                    {description}
                  </p>
                </div>

                {/* Image side */}
                <div className="w-full sm:flex-1 flex items-center justify-center">
                  <div className="relative w-full max-w-xl">
                    <div className="rounded-3xl bg-[#D6E8FF] w-full h-80 sm:h-[420px]" />
                    <div
                      className={`absolute inset-x-0 flex justify-center ${
                        imageAnchor === 'top'
                          ? 'top-0 items-start'
                          : 'bottom-0 items-end'
                      }`}
                    >
                      <img
                        src={image}
                        alt={title}
                        className="w-56 sm:w-auto object-contain drop-shadow-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
