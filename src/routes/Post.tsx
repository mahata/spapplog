import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { remark } from 'remark'
import html from 'remark-html'

const posts = import.meta.glob('../../posts/*.md', {
  query: '?raw',
  import: 'default',
})

export default function Post() {
  const { slug = '' } = useParams()
  const [markdown, setMarkdown] = useState<string | null | undefined>(undefined)
  const [loadedSlug, setLoadedSlug] = useState('')

  useEffect(() => {
    const postPath = `../../posts/${slug}.md`
    const loadPost = posts[postPath]

    let isCancelled = false

    const loadContent = async () => {
      if (!loadPost) {
        return null
      }
      try {
        return await loadPost() as string
      } catch (error) {
        console.error('Error loading post:', error)
        return null
      }
    }

    loadContent().then((content) => {
      if (!isCancelled) {
        setMarkdown(content)
        setLoadedSlug(slug)
      }
    })

    return () => {
      isCancelled = true
    }
  }, [slug])

  const renderedHtml = useMemo(() => {
    if (markdown === undefined || markdown === null) return ''
    try {
      const processed = remark().use(html).processSync(markdown)
      return String(processed)
    } catch (error) {
      console.error('Error processing markdown:', error)
      return '<p>Error rendering post content.</p>'
    }
  }, [markdown])

  // Derive loading state from whether we've loaded the current slug
  const isLoading = loadedSlug !== slug

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (markdown === null) {
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
