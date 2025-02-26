interface SubsectionProps {
  title: string
  items: string[]
}

interface ProductSectionProps {
  title: string
  content: string
  subsections?: SubsectionProps[]
}

export function ProductSection({ title, content, subsections }: ProductSectionProps) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-primary">{title}</h2>
      <div className="prose dark:prose-invert max-w-none mb-6">
        <p className="text-gray-700 dark:text-gray-300">{content}</p>
      </div>
      
      {subsections && subsections.map((subsection, index) => (
        <div key={index} className="mt-6">
          <h3 className="text-lg font-medium mb-3 dark:text-gray-200">{subsection.title}</h3>
          <ul className="list-disc pl-6 space-y-2">
            {subsection.items.map((item, itemIndex) => (
              <li key={itemIndex} className="text-gray-600 dark:text-gray-400">{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

interface GuidelinesSectionProps {
  title: string
  items: string[]
}

export function GuidelinesSection({ title, items }: GuidelinesSectionProps) {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-primary">{title}</h2>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span className="text-gray-700 dark:text-gray-300">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

interface ContactInfoProps {
  name: string
  role: string
  email: string
}

export function ContactInfo({ name, role, email }: ContactInfoProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Contact Information</h2>
      <div className="space-y-2">
        <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Name:</span> {name}</p>
        <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Role:</span> {role}</p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">Email:</span>{' '}
          <a href={`mailto:${email}`} className="text-primary hover:underline">
            {email}
          </a>
        </p>
      </div>
    </div>
  )
} 