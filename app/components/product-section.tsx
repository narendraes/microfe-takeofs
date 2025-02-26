interface ProductSectionProps {
  title: string
  content: string
}

export function ProductSection({ title, content }: ProductSectionProps) {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">{title}</h2>
      <div className="prose dark:prose-invert max-w-none">
        <p>{content}</p>
      </div>
    </section>
  )
} 