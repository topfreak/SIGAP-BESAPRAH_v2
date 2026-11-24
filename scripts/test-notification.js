import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await context.newPage();

  console.log('1. Navigating to http://localhost:3000/login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(500);

  console.log('2. Logging in as superadmin...');
  await page.fill('input[type="text"]', 'superadmin');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await page.waitForTimeout(1000);

  const artifactDir = 'C:/Users/topik/.gemini/antigravity/brain/48301644-ae8e-4789-b108-2161b227ae90';

  console.log('3. Clicking Notification Bell...');
  const bellBtn = await page.waitForSelector('button[aria-label="Pemberitahuan"]');
  await bellBtn.click();
  await page.waitForTimeout(800);

  console.log('4. Capturing screenshot with open notification dropdown...');
  await page.screenshot({ path: `${artifactDir}/screenshot_notification_dropdown.png`, fullPage: false });

  console.log('5. Clicking "Simulasi Notifikasi" button to trigger toast...');
  const simulateBtn = await page.waitForSelector('text=Simulasi Notifikasi');
  await simulateBtn.click();
  await page.waitForTimeout(1000);

  console.log('6. Capturing screenshot with floating Toast notification...');
  await page.screenshot({ path: `${artifactDir}/screenshot_notification_toast.png`, fullPage: false });

  console.log('TEST_NOTIFICATION_SUCCESS');
  await browser.close();
})();
