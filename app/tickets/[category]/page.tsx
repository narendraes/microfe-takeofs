import { notFound } from "next/navigation"
import { productContent } from "@/app/config/product-content"
import { ProductSection, GuidelinesSection, ContactInfo } from "@/src/components/product-section"

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

  const content = productContent[params.category]
  
  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">Content Coming Soon</h1>
        <p className="dark:text-gray-300">The content for this product area is being developed.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 dark:text-gray-100">{content.title}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{content.description}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {content.sections.map((section, index) => (
            <ProductSection 
              key={index}
              title={section.title}
              content={section.content}
              subsections={section.subsections}
            />
          ))}
        </div>
        
        <div className="space-y-8">
          <GuidelinesSection 
            title={content.guidelines.title}
            items={content.guidelines.items}
          />
          <ContactInfo {...content.contactInfo} />
          
          <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium shadow-sm transition-colors">
            Submit New Idea
          </button>
        </div>
      </div>
    </div>
  )
}

