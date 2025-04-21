import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  paths: ['features/**/*.feature'],
  require: ['steps/**/*.ts',  // This will include all .ts files in steps and its subfolders
            'steps/**/*.steps.ts',  // Specifically for files ending with .steps.ts
            'steps/api/*.ts'     // Explicitly include api subfolder], 
  ],
  outputDir: '.features-gen'
});

export default defineConfig({
  globalSetup: 'globalSetup.ts',
  testDir,
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    navigationTimeout: 15000,
    ignoreHTTPSErrors: true,
    video: 'on',
    screenshot: 'on',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: './test-results/',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
});
