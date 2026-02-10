import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/support')({
  component: SupportPage,
})

function SupportPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Support</h1>
      <p className="text-gray-600 mt-2">Get help and support</p>
    </div>
  )
}
