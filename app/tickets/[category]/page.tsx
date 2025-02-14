import { notFound } from "next/navigation"

const validCategories = [
  "bank",
  "directed-pay",
  "sso-api",
  "commercial-pay",
  "commercial-provider",
  "data-engineering",
  "hba",
  "cams-rra",
  "tools",
  "phoenix-team",
]

export default function TicketPage({ params }: { params: { category: string } }) {
  if (!validCategories.includes(params.category)) {
    notFound()
  }

  const title = params.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{title} Tickets</h1>
      <p>This is a configurable subpage for {title} tickets.</p>
      {/* Add your ticket management UI components here */}
    </div>
  )
}

