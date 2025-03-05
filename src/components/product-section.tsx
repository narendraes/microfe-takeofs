interface SubsectionProps {
  title: string
  items: string[]
}

interface ProductSectionProps {
  title: string
  content: string
}

export function ProductSection({ title, content }: ProductSectionProps) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-primary">{title}</h2>
      <div 
        className="prose dark:prose-invert prose-headings:text-primary prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:font-bold prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4 prose-p:my-2 max-w-none mb-6 text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: content }}
      />
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