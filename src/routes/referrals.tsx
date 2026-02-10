import { Copy } from '@/assets'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/referrals')({
  component: ReferralsPage,
})

const howItWorksSteps = [
  {
    id: 1,
    title: 'Your friends join Merit',
    subtitle: 'And start earning',
  },
  {
    id: 2,
    title: 'Score 10% from buddies Friends',
    subtitle: 'You get $2 for everyone you referred',
  },
]

function ReferralsPage() {
  const referralLink = 'merit.com/shebhi1234432'

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 w-full">
      <div
        className="bg-[#0081A1] rounded-2xl p-8 text-center relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/coins-pattern.png')",
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <h1 className="text-white text-3xl font-bold mb-2">
          Invite your friends 🪙
        </h1>
        <h2 className="text-white text-3xl font-bold mb-2">and earn more</h2>
        <p className="text-white/90 text-sm">
          Earn $ for every of your referral
        </p>
      </div>

      <section className="bg-white rounded-2xl p-6 border border-[#E8E8E8]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 font-semibold mb-1">
              Your Referral Link
            </h3>
            <p className="text-gray-500 text-sm">{referralLink}</p>
          </div>
          <button
            onClick={copyToClipboard}
            className="bg-[#EDF1FF] cursor-pointer text-white p-3 rounded-full transition-all"
          >
            <Copy />
          </button>
        </div>
      </section>

      <div className="p-6">
        <div>
          <h4 className="text-[#149AEE] font-semibold mb-4">How it works</h4>
          <div className="space-y-4">
            {howItWorksSteps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-[#149AEE] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {step.id}
                  </div>
                  {index < howItWorksSteps.length - 1 && (
                    <div className="w-0.5 h-12 bg-[#149AEE]/30 my-1"></div>
                  )}
                </div>
                <div className="pt-1">
                  <p className="text-gray-900 font-medium mb-1">{step.title}</p>
                  <p className="text-gray-500 text-sm">{step.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="w-full cursor-pointer bg-[#149AEE] hover:bg-[#0B7FD4] text-white py-3 rounded-lg font-semibold transition-all">
        Invite Friends
      </button>
    </div>
  )
}
