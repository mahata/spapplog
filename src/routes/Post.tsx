import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { remark } from 'remark'
import html from 'remark-html'

const postLoaders = Object.fromEntries(
  Object.entries(
    import.meta.glob('../../posts/*.md', {
      query: '?raw',
      import: 'default',
      eager: false,
    }),
  ).map(([path, loader]) => {
    const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? ''
    return [slug, loader as () => Promise<string>]
  }),
)

export default function Post() {
  const { slug = '' } = useParams()
  const [markdown, setMarkdown] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true)
      setNotFound(false)
      
      const loader = postLoaders[slug]
      if (!loader) {
        setNotFound(true)
        setLoading(false)
        return
      }

      try {
        const content = await loader()
        setMarkdown(content)
      } catch (error) {
        console.error('Error loading post:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [slug])

  const renderedHtml = useMemo(() => {
    if (!markdown) return ''
    const processed = remark().use(html).processSync(markdown)
    return String(processed)
  }, [markdown])

  if (loading) {
    return <div>Loading...</div>
  }

  if (notFound || !markdown) {
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
