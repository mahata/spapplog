import { test, expect } from '@playwright/experimental-ct-react'
import type { ComponentFixtures } from '@playwright/experimental-ct-react'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'

const mountApp = async (mount: ComponentFixtures['mount']) => {
  return await mount(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  )
}

test('should render heading', async ({ mount }) => {
  const component = await mountApp(mount)

  await expect(component.getByRole('heading', { name: 'Vite + React' })).toBeVisible()
})

test('should render health link with correct href', async ({ mount }) => {
  const component = await mountApp(mount)

  const link = component.getByRole('link', { name: '/health' })
  await expect(link).toHaveAttribute('href', '/health')
})
