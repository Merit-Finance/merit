import { MeritLogo } from '@/assets'
import { UserName } from '@/assets/svgs'
import { navItems } from '@/constants'
import { useAuthStore } from '@/stores/auth.stores'
import { Link } from '@tanstack/react-router'
import { Menu, X, LogOut, User } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const { user, logout } = useAuthStore()
  const isAuthenticated = !!user
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  const getUserInitials = () => {
    if (!user?.name) return 'U'
    const names = user.name.trim().split(' ').filter(Boolean)
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return names[0][0].toUpperCase()
  }
  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            )}
            <Link
              to="/dashboard"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <MeritLogo className="h-6 w-6 sm:h-8 sm:w-8 text-[#008FE9]" />
              <span className="text-lg sm:text-xl font-semibold text-primary">
                Merit Finance
              </span>
            </Link>
          </div>

          {isAuthenticated && (
            <>
              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-8">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center gap-2 group"
                    >
                      {({ isActive }: any) => (
                        <>
                          <Icon
                            className={`w-5 h-5 transition-all ${
                              isActive
                                ? 'text-primary opacity-100'
                                : 'text-gray-500 opacity-50 group-hover:text-primary group-hover:opacity-100'
                            }`}
                          />
                          <span
                            className={`font-medium transition-colors ${
                              isActive
                                ? 'text-primary'
                                : 'text-gray-700 group-hover:text-primary'
                            }`}
                          >
                            {item.name}
                          </span>
                        </>
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Desktop Right */}
              <div className="hidden lg:flex items-center gap-4">
                <div className="relative group">
                  <div className="flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        <span className="text-sm font-medium text-primary">
                          {getUserInitials()}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          {user?.role || 'Investor'}
                        </div>
                      </div>
                    </div>
                    <UserName />
                  </div>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate break-all">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>

                {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button> */}
              </div>

              {/* Mobile Right — bell only */}
              {/* <div className="flex lg:hidden items-center">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
              </div> */}
            </>
          )}
        </div>
      </header>

      {/* Mobile Menu Drawer — slides from the LEFT */}
      {isAuthenticated && (
        <>
          {/* Backdrop */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          <div
            className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-base font-semibold text-primary">
                    {getUserInitials()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <nav className="px-3 py-4 flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
                    activeProps={{ className: 'bg-primary/10 text-primary' }}
                    inactiveProps={{
                      className: 'text-gray-700 hover:bg-gray-50',
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-gray-100 flex flex-col gap-1">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-medium text-sm">Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
