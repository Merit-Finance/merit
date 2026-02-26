import { createFileRoute, Link } from '@tanstack/react-router'
import { MeritLogo } from '@/assets'

export const Route = createFileRoute('/terms-of-use')({
  component: TermsOfUsePage,
})

const sections = [
  {
    number: '1',
    title: 'Eligibility',
    list: [
      'You must be at least 18 years old to use the Service.',
      'By using the Service, you confirm you have the legal capacity to enter into these Terms and comply with all applicable laws and regulations.',
    ],
  },
  {
    number: '2',
    title: 'Account Registration',
    list: [
      'You may be required to create an account to access certain features.',
      'You agree to provide accurate, complete, and up-to-date information when registering.',
      'You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.',
      'Notify us immediately of any unauthorized use or security breach.',
    ],
  },
  {
    number: '3',
    title: 'Use of the Service',
    content:
      'You agree to use the Service only for lawful purposes and in accordance with these Terms. You will not:',
    list: [
      'Engage in fraud, money laundering, or other illegal activities',
      "Attempt to access other users' accounts or sensitive information",
      "Interfere with the Service's functionality, security, or data integrity",
    ],
    footer:
      'All content and information provided through the Service is for personal, non-commercial use unless otherwise authorized.',
  },
  {
    number: '4',
    title: 'Financial Transactions',
    list: [
      'Certain features of the Service may involve financial transactions, including deposits, withdrawals, or crypto exchanges.',
      'You acknowledge the inherent risks in digital financial transactions and agree that you are responsible for all decisions and risks associated with your account activity.',
      'We are not responsible for losses due to market volatility, user error, or third-party platform failures.',
    ],
  },
  {
    number: '5',
    title: 'Intellectual Property',
    list: [
      'All content, software, logos, and trademarks associated with the Service are the property of Merit Finance or its licensors.',
      'You may not copy, reproduce, distribute, or create derivative works without our written permission.',
    ],
  },
  {
    number: '6',
    title: 'Privacy',
    content:
      'Your use of the Service is subject to our Privacy Policy, which explains how we collect, use, and protect your personal information.',
  },
  {
    number: '7',
    title: 'Limitation of Liability',
    list: [
      'The Service is provided "as-is" and "as available."',
      'We do not guarantee uninterrupted or error-free service.',
      'To the maximum extent permitted by law, Merit Finance, its affiliates, and partners are not liable for any direct, indirect, incidental, or consequential damages, including loss of funds, data, or profits.',
    ],
  },
  {
    number: '8',
    title: 'Indemnification',
    content:
      'You agree to defend, indemnify, and hold harmless Merit Finance, its officers, employees, and affiliates from and against any claims, liabilities, damages, or expenses arising from your use of the Service, violation of these Terms, or violation of any law or rights of a third party.',
  },
  {
    number: '9',
    title: 'Modifications',
    list: [
      'We may modify or suspend the Service, or update these Terms at any time.',
      'Continued use of the Service after changes constitutes acceptance of the new Terms.',
      'We encourage users to review these Terms regularly.',
    ],
  },
  {
    number: '10',
    title: 'Termination',
    list: [
      'We may suspend or terminate your account for violations of these Terms or for any reason at our discretion.',
      'Termination does not affect obligations or liabilities incurred before termination.',
    ],
  },
  {
    number: '11',
    title: 'Governing Law',
    list: [
      'These Terms are governed by and construed in accordance with applicable laws.',
      'Any disputes arising under these Terms shall be resolved in the competent courts of the relevant jurisdiction.',
    ],
  },
  {
    number: '12',
    title: 'Contact Us',
    content: 'If you have questions regarding these Terms, please contact:',
    contact: {
      team: 'Merit Finance Support Team',
      email: 'support@meritfinance.org',
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
      </div>
    </div>
  )
}

function TermsOfUsePage() {
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
              Terms of Use
            </h1>
            <p className="text-xs text-gray-400">
              Effective Date: 26/02/2026 · Last Updated: 26/02/2026
            </p>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Welcome to Merit Finance. By accessing or using our services at
              https://meritfinance.org, you agree to comply with and be bound by
              these Terms of Use. If you do not agree, please do not use the
              Service.
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
