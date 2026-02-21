import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Header from '@/components/Header'
import '../styles.css'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRoute<MyRouterContext>({
  component: RootComponent,
})

const AUTH_ROUTES = ['/', '/signup']

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isAuthRoute = AUTH_ROUTES.includes(pathname)

  return (
    <>
      {!isAuthRoute && <Header />}
      <main
        className={
          !isAuthRoute
            ? 'px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-[1500px] mx-auto'
            : ''
        }
      >
        <Outlet />
      </main>
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  )
}
