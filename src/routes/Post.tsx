import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { remark } from 'remark'
import html from 'remark-html'

const posts = Object.fromEntries(
  Object.entries(
    import.meta.glob('../../posts/*.md', {
      query: '?raw',
      import: 'default',
      eager: true,
    }),
  ).map(([path, content]) => {
    const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? ''
    return [slug, content as string]
  }),
)

export default function Post() {
  const { slug = '' } = useParams()
  const markdown = posts[slug]

  const renderedHtml = useMemo(() => {
    if (markdown === undefined) return ''
    try {
      const processed = remark().use(html).processSync(markdown)
      return String(processed)
    } catch (error) {
      console.error('Error processing markdown:', error)
      return '<p>Error rendering post content.</p>'
    }
  }, [markdown])

  if (markdown === undefined) {
    return (
      <div>
        <p>Post not found.</p>
        <p>
          <Link to="/">Back home</Link>
        </p>
      </div>
    )
  }

  return (
    <article dangerouslySetInnerHTML={{ __html: renderedHtml }} />
  )
}
