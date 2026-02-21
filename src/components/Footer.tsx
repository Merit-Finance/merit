export default function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white px-6 py-5 text-sm text-gray-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 sm:flex-row">
        <p className="text-xs text-gray-400">
          © {currentYear}{' '}
          <span className="font-medium text-gray-700">Merit Finance</span>. All
          rights reserved.
        </p>
      </div>
    </footer>
  )
}
