interface ProductSectionProps {
  title: string
  content: string
}

export function ProductSection({ title, content }: ProductSectionProps) {
  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="prose max-w-none">
        <p>{content}</p>
      </div>
    </section>
  )
} 