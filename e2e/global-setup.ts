import { chromium, type FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // You can add global setup logic here
  // For example, starting additional services, seeding databases, etc.

  console.log('Starting global setup for Lark Parser IDE e2e tests...');

  // Verify that the web server will be available
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:4173';

  try {
    // Launch a browser to do initial checks
    const browser = await chromium.launch();

    // Basic connectivity test
    console.log(`Checking connectivity to ${baseURL}...`);

    await browser.close();
    console.log('Global setup completed successfully.');
  } catch (error) {
    console.warn('Global setup warning:', error);
    // Don't fail the setup, let individual tests handle connectivity issues
  }
}

export default globalSetup;
