import './Section.css'

type SectionProps = {
  title: string
  badge?: string
  badgeVariant?: 'default' | 'accent' | 'secondary'
  description?: string
  checklist?: string[]
  children: React.ReactNode
  className?: string
}

export function Section({
  title,
  badge,
  badgeVariant = 'default',
  description,
  checklist,
  children,
  className = '',
}: SectionProps) {
  return (
    <section className={'section ' + className}>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {badge && (
          <span className={'section-badge section-badge--' + badgeVariant}>
            {badge}
          </span>
        )}
      </div>
      {description && <p className="section-description">{description}</p>}
      {checklist && checklist.length > 0 && (
        <ul className="section-checklist">
          {checklist.map((item, i) => (
            <li key={i}>
              <span className="section-check" aria-hidden>✓</span>
              {item}
            </li>
          ))}
        </ul>
      )}
      <div className="section-body">{children}</div>
    </section>
  )
}
