import { DashboardIcon, EarningIcon, PeopleIcon } from '@/assets'

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
] as const
