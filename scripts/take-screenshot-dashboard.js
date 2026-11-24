import { chromium } from 'playwright';
import { PEGAWAI_LIST } from '../src/lib/seedData.js';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000/login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(500);

  console.log('Logging in as superadmin...');
  await page.fill('input[type="text"]', 'superadmin');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');

  // Wait for dashboard
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await page.waitForTimeout(1500);

  console.log('Capturing screenshots...');
  const artifactDir = 'C:/Users/topik/.gemini/antigravity/brain/48301644-ae8e-4789-b108-2161b227ae90';
  await page.screenshot({ path: `${artifactDir}/screenshot_dashboard_clean_full.png`, fullPage: true });
  await page.screenshot({ path: `${artifactDir}/screenshot_dashboard_clean_viewport.png`, fullPage: false });

  console.log('SCREENSHOT_SUCCESS');
  await browser.close();
})();
