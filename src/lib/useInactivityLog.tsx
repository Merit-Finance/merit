import { useAuthStore } from '@/stores/auth.stores'
import { useEffect, useRef, useCallback } from 'react'
import { clearAuthAndRedirect } from './api-client'

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000 // 15 minutes — adjust as needed
const WARNING_BEFORE_MS = 60 * 1000 // warn 1 minute before logout

interface UseInactivityLogoutOptions {
  onWarning?: (secondsLeft: number) => void
  timeoutMs?: number
}

export function useInactivityLogout({
  onWarning,
  timeoutMs = INACTIVITY_TIMEOUT_MS,
}: UseInactivityLogoutOptions = {}) {
  const logout = useAuthStore((s) => s.logout)
  const accessToken = useAuthStore((s) => s.accessToken)
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current)
    if (warningTimer.current) clearTimeout(warningTimer.current)
  }, [])

  const resetTimers = useCallback(() => {
    clearTimers()

    // Warning timer
    if (onWarning) {
      warningTimer.current = setTimeout(() => {
        onWarning(Math.round(WARNING_BEFORE_MS / 1000))
      }, timeoutMs - WARNING_BEFORE_MS)
    }

    logoutTimer.current = setTimeout(() => {
      logout()
      clearAuthAndRedirect()
    }, timeoutMs)
  }, [clearTimers, logout, onWarning, timeoutMs])

  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ]

    const handleActivity = () => resetTimers()

    events.forEach((e) =>
      window.addEventListener(e, handleActivity, { passive: true }),
    )
    resetTimers()

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity))
      clearTimers()
    }
  }, [accessToken, resetTimers, clearTimers])
}
