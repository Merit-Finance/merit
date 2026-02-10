import { DashboardIcon, EarningIcon, PeopleIcon, SupportIcon } from '@/assets'

export const navItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: DashboardIcon,
  },
  {
    name: 'My Earnings',
    path: '/earnings',
    icon: EarningIcon,
  },
  {
    name: 'Referrals',
    path: '/referrals',
    icon: PeopleIcon,
  },
  {
    name: 'Support',
    path: '/support',
    icon: SupportIcon,
  },
] as const
