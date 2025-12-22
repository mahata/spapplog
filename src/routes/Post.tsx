import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { remark } from 'remark'
import html from 'remark-html'

const posts = import.meta.glob<string>('/posts/*.md', {
  as: 'raw',
  eager: true,
})

export default function Post() {
  const { slug = '' } = useParams()
  const markdown = posts[`/posts/${slug}.md`]

  const renderedHtml = useMemo(() => {
    if (!markdown) return ''
    const processed = remark().use(html).processSync(markdown)
    return String(processed)
  }, [markdown])

  if (!markdown) {
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
