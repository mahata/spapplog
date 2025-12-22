import { test, expect } from '@playwright/experimental-ct-react'
import type { ComponentFixtures } from '@playwright/experimental-ct-react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Post from './Post'

const mountAtPath = async (mount: ComponentFixtures['mount'], path: string) => {
  return await mount(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/posts/:slug" element={<Post />} />
      </Routes>
    </MemoryRouter>,
  )
}

test('renders existing markdown post', async ({ mount }) => {
  const component = await mountAtPath(mount, '/posts/yo')

  await expect(component.getByRole('heading', { name: 'Hey' })).toBeVisible()
  await expect(component).toContainText('Yo.')
})

test('shows not found for missing post', async ({ mount }) => {
  const component = await mountAtPath(mount, '/posts/missing')

  await expect(component).toContainText('Post not found.')
  const backLink = component.getByRole('link', { name: 'Back home' })
  await expect(backLink).toHaveAttribute('href', '/')
})
