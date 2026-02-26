import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Header from '@/components/Header'
import '../styles.css'
import 'react-phone-number-input/style.css'
import type { QueryClient } from '@tanstack/react-query'
import Footer from '@/components/Footer'
import { useAuthStore } from '@/stores/auth.stores'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRoute<MyRouterContext>({
  component: RootComponent,
})

const AUTH_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify',
]

const PUBLIC_ROUTES = ['/']

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const isAuthRoute = AUTH_ROUTES.includes(pathname)
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
  const isAppRoute = !isAuthRoute && !isPublicRoute

  useEffect(() => {
    // Not logged in and trying to access app routes → send to login
    if (!user && isAppRoute) {
      navigate({ to: '/login' })
    }
    // Logged in and on an auth page (login, signup etc) → send to dashboard
    if (user && isAuthRoute) {
      navigate({ to: '/dashboard' })
    }
    // Landing page: if already logged in, skip straight to dashboard
    if (user && isPublicRoute) {
      navigate({ to: '/dashboard' })
    }
  }, [user, pathname])

  return (
    <div className="flex min-h-screen flex-col">
      {isAppRoute && <Header />}
      <main
        className={
          isAppRoute
            ? 'flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-[1500px] mx-auto w-full'
            : 'flex-1'
        }
      >
        <Outlet />
      </main>
      {isAppRoute && <Footer />}
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  )
}
