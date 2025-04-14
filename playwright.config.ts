import { defineConfig, devices } from '@playwright/test';
import { cucumberReporter, defineBddConfig } from 'playwright-bdd';


const testDir = defineBddConfig( {
    features: ['features/*.feature'],
    steps: ['steps/*.steps.ts']
});


export default defineConfig({
  globalSetup: 'globalSetup.ts',
  testDir,
// testDir: 'rc/features',
//   : './src/features', // Directory where your `.feature` files are located
  timeout: 30 * 1000, // Maximum time one test can run
  expect: {
    timeout: 5000, // Timeout for assertions
  },
  retries: 0, // Retry failed tests once
  workers: process.env.CI ? 1 : undefined, // Run tests sequentially in CI
  use: {
    // baseURL: process.env.BASE_URL || 'http://localhost:3000', // Base URL for your tests
    // headless: false, // Run tests in headless mode
    viewport: { width: 1280, height: 720 }, // Default viewport size
    actionTimeout: 0, // Maximum time for each Playwright action
    ignoreHTTPSErrors: true, // Ignore HTTPS errors
    video: 'on', // Record a video for the first retry
    screenshot: 'on', // Take a screenshot if a test fails
    trace: 'on-first-retry', // Collect trace for debugging first retry
  },
  projects: [
    {
        name: 'Chromium',
        use: { ...devices['Desktop Chrome'] },
      },
      
    ],
    outputDir: './test-results/', // Directory for test results
    reporter: [
      ['list'], // Default test reporter
      ['html', { outputFolder: 'playwright-report', open: 'never' }], // HTML report
      cucumberReporter('html', {
        outputFile: `cucumber-report/report.html`,
      })
    ],
  });
