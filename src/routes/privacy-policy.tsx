import { createFileRoute } from '@tanstack/react-router'
import { MeritLogo } from '@/assets'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy-policy')({
  component: PrivacyPolicyPage,
})

const sections = [
  {
    number: '1',
    title: 'Information We Collect',
    subsections: [
      {
        title: '1.1 Personal Information',
        content:
          'We may collect personal information that you voluntarily provide to us when you register, access your account, or contact us. Such information may include:',
        list: [
          'Full name',
          'Email address',
          'Phone number',
          'House address',
          'Wallet addresses and crypto transaction details',
        ],
      },
      {
        title: '1.2 Usage Data',
        content:
          'We automatically collect information about how you interact with the Service, including:',
        list: [
          'IP address',
          'Browser type and version',
          'Device information',
          'Pages visited',
          'Time and date of access',
          'Referral source',
        ],
      },
      {
        title: '1.3 Cookies and Tracking Technologies',
        content:
          'We use cookies and similar tracking technologies to improve your experience, analyze usage patterns, and deliver personalized content. You can manage cookie preferences through your browser settings.',
      },
    ],
  },
  {
    number: '2',
    title: 'How We Use Your Information',
    content: 'We use the information we collect to:',
    list: [
      'Provide, manage, and improve the Service',
      'Communicate with you (e.g., support, updates, security alerts)',
      'Personalize your experience',
      'Detect, prevent, and address fraud and other illegal activities',
      'Analyze usage trends and enhance user experience',
    ],
  },
  {
    number: '3',
    title: 'Sharing Your Information',
    content:
      'We do not sell your personal data to third parties. We may share your information with:',
    list: [
      'Service Providers: Third-party vendors that help operate the Service (e.g., cloud hosting, analytics).',
      'Legal and Compliance: Law enforcement, regulators, or courts when required by law or to protect our rights.',
      'Business Transfers: If we merge, are acquired, or reorganize, your information may be transferred as part of that transaction.',
    ],
    footer:
      'All third parties we work with are required to protect your data and only use it for specified purposes.',
  },
  {
    number: '4',
    title: 'Data Security',
    content:
      'We implement administrative, technical, and physical safeguards designed to protect your information. While we strive to protect your data, no method of transmission or storage is 100% secure. You understand and agree that you provide your information at your own risk.',
  },
  {
    number: '5',
    title: 'Retention of Your Information',
    content:
      'We retain your personal information only as long as necessary to:',
    list: [
      'Provide the Service',
      'Comply with our legal obligations',
      'Resolve disputes',
      'Enforce our agreements',
    ],
    footer:
      'After it is no longer needed, we securely delete or anonymize your data.',
  },
  {
    number: '6',
    title: 'Your Rights',
    content:
      'Depending on your location, you may have rights regarding your personal data, including:',
    list: [
      'Accessing and updating your information',
      'Requesting deletion of your data',
      'Restricting or objecting to processing',
      'Withdrawing consent',
    ],
    footer: 'To exercise any rights, contact us at the address below.',
  },
  {
    number: '7',
    title: "Children's Privacy",
    content:
      'The Service is not intended for children under 18. We do not knowingly collect personal information from minors below this age. If we discover that we have collected such information, we will promptly delete it.',
  },
  {
    number: '8',
    title: 'International Data Transfers',
    content:
      'Your information may be transferred to and processed in countries other than your own. By using the Service, you consent to such transfers in accordance with this Privacy Policy.',
  },
  {
    number: '9',
    title: 'Changes to This Policy',
    content:
      'We may update this policy to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or through the Service. The "Last Updated" date will always reflect the current version.',
  },
  {
    number: '10',
    title: 'Contact Us',
    content:
      'If you have questions, concerns, or requests regarding this Privacy Policy, please contact:',
    contact: {
      team: 'Merit Finance Privacy Team',
      email: 'privacy@meritfinance.org',
    },
  },
]

function Section({ section }: { section: any }) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-bold text-gray-900 mb-3 flex items-start gap-2">
        <span className="text-primary font-bold">{section.number}.</span>
        <span>{section.title}</span>
      </h2>
      <div className="pl-5 space-y-3">
        {section.subsections ? (
          <div className="space-y-4">
            {section.subsections.map((sub: any, i: number) => (
              <div key={i}>
                <h3 className="text-sm font-semibold text-gray-700 mb-1.5">
                  {sub.title}
                </h3>
                {sub.content && (
                  <p className="text-sm text-gray-500 leading-relaxed mb-2">
                    {sub.content}
                  </p>
                )}
                {sub.list && (
                  <ul className="space-y-1.5">
                    {sub.list.map((item: string, j: number) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-gray-500"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <>
            {section.content && (
              <p className="text-sm text-gray-500 leading-relaxed">
                {section.content}
              </p>
            )}
            {section.list && (
              <ul className="space-y-1.5">
                {section.list.map((item: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-500"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {section.footer && (
              <p className="text-sm text-gray-500 leading-relaxed">
                {section.footer}
              </p>
            )}
            {section.contact && (
              <div className="bg-gray-50 border border-[#E8E8E8] rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-700">
                  {section.contact.team}
                </p>
                <a
                  href={`mailto:${section.contact.email}`}
                  className="text-sm text-primary hover:underline"
                >
                  {section.contact.email}
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-[#E8E8E8] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MeritLogo className="h-6 w-6 text-[#008FE9]" />
            <span className="text-gray-900 font-semibold text-base">
              Merit Finance
            </span>
          </div>
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Back to App
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-[#E8E8E8] p-8">
          <div className="border-b border-[#E8E8E8] pb-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Privacy Policy
            </h1>
            <p className="text-xs text-gray-400">
              Effective Date: 26/02/2026 · Last Updated: 26/02/2026
            </p>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Thank you for using Merit Finance. Your privacy and the security
              of your personal information are extremely important to us. This
              Privacy Policy explains how we collect, use, disclose, and protect
              information when you visit or interact with
              https://meritfinance.org. By accessing or using our Service, you
              agree to the terms of this Privacy Policy. If you do not agree,
              please do not use the Service.
            </p>
          </div>
          {sections.map((section, i) => (
            <Section key={i} section={section} />
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Merit Finance. All rights reserved.
        </p>
      </div>
    </div>
  )
}
