import { MeritLogo } from '@/assets'
import { UserName } from '@/assets/svgs'
import { navItems } from '@/constants'
import { useAuthStore } from '@/stores/auth.stores'
import { Link } from '@tanstack/react-router'
import { Bell } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuthStore()
  const isAuthenticated = !!user

  const handleLogout = () => {
    logout()
  }

  const getUserInitials = () => {
    if (!user?.name) return 'U'
    const names = user.name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return user.name[0].toUpperCase()
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-3 flex items-center justify-between max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <MeritLogo className="h-8 w-8 text-[#008FE9]" />
          <span className="text-xl font-semibold text-primary">
            Merit Finance
          </span>
        </div>

        {isAuthenticated && (
          <>
            <nav className="flex items-center gap-8">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-2 group"
                  >
                    {({ isActive }) => (
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

            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {getUserInitials()}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        {user?.role || 'User'}
                      </div>
                    </div>
                  </div>
                  <UserName />
                </div>

                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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
                      to="/"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      Settings
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

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
