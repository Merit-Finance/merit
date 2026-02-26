import { useNavigate } from '@tanstack/react-router'

export function Footer() {
  const navigate = useNavigate()

  return (
    <>
      <section className="w-full bg-[#EDF2F6] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-5">
          <h2 className="text-4xl sm:text-5xl font-semibold text-[#19415A]">
            Ready to Begin?
          </h2>
          <p className="text-gray-400 text-base">
            Take your first step into a structured digital earning ecosystem.
          </p>
          <button
            onClick={() => navigate({ to: '/signup' })}
            className="mt-2 px-7 cursor-pointer py-3 bg-[#149AEE] hover:bg-[#0B7FD4] text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-blue-200"
          >
            Create Your Account Today
          </button>
        </div>
      </section>

      <footer className="w-full px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-xs">
            ©2026 MERIT FINANCE · All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate({ to: '/' })}
              className="text-gray-400 cursor-pointer hover:text-[#149AEE] text-xs transition-colors"
            >
              Term of use
            </button>
            <button
              onClick={() => navigate({ to: '/' })}
              className="text-gray-400 cursor-pointer hover:text-[#149AEE] text-xs transition-colors"
            >
              Privacy policy
            </button>
          </div>
        </div>
      </footer>
    </>
  )
}
