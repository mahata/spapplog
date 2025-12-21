import { defineConfig, devices } from '@playwright/experimental-ct-react'

export default defineConfig({
  testDir: './src',
  testMatch: ['**/*.ct.spec.{ts,tsx}'],
  fullyParallel: true,
  reporter: process.env.CI
    ? [['list']]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
})
