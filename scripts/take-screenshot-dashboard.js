import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000/dashboard...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(600);

  // Jika dialihkan ke halaman login, lakukan login
  if (page.url().includes('/login')) {
    console.log('Logging in as superadmin...');
    await page.fill('input[type="text"]', 'superadmin');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForTimeout(1000);
  }

  console.log('Capturing screenshots...');
  const artifactDir = 'C:/Users/topik/.gemini/antigravity/brain/48301644-ae8e-4789-b108-2161b227ae90';
  await page.screenshot({ path: `${artifactDir}/screenshot_dashboard_clean_viewport.png`, fullPage: false });

  // Tangkap elemen Donut Chart secara spesifik
  const donutElement = await page.$('.relative.w-36.h-36');
  if (donutElement) {
    await donutElement.screenshot({ path: `${artifactDir}/screenshot_donut_center.png` });
  }

  console.log('SCREENSHOT_SUCCESS');
  await browser.close();
})();
