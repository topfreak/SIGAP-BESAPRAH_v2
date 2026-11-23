/**
 * SIGAP BESAPRAH - Visual Automated Browser Runner with Virtual Cursor
 * Runner ini membuka jendela Chromium mandiri dan menampilkan kursor visual
 * yang bergerak secara halus (smooth motion) ke setiap target elemen.
 */

import { chromium } from 'playwright';

// Skrip injeksi untuk membuat kursor visual animasi di dalam halaman browser
const VIRTUAL_CURSOR_INJECTION = `
(() => {
  if (document.getElementById('sigap-virtual-cursor')) return;

  const cursor = document.createElement('div');
  cursor.id = 'sigap-virtual-cursor';
  cursor.style.cssText = \`
    position: fixed;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, #ef4444 40%, rgba(239, 68, 68, 0.4) 80%);
    border: 2px solid #ffffff;
    border-radius: 50%;
    pointer-events: none;
    z-index: 999999;
    transform: translate(-50%, -50%);
    transition: transform 0.08s ease, width 0.15s ease, height 0.15s ease, background 0.15s ease;
    box-shadow: 0 0 12px rgba(239, 68, 68, 0.75), 0 2px 6px rgba(0, 0, 0, 0.3);
  \`;

  // Pointer icon arrow kecil di samping cursor
  const pointer = document.createElement('div');
  pointer.style.cssText = \`
    position: absolute;
    top: -2px;
    left: -2px;
    width: 0;
    height: 0;
    border-left: 9px solid #b91c1c;
    border-right: 5px solid transparent;
    border-bottom: 12px solid transparent;
    pointer-events: none;
  \`;
  cursor.appendChild(pointer);

  document.body.appendChild(cursor);

  // Efek riak saat klik
  window.addEventListener('mousedown', (e) => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.75)';
    cursor.style.background = '#dc2626';

    const ripple = document.createElement('div');
    ripple.style.cssText = \`
      position: fixed;
      top: \${e.clientY}px;
      left: \${e.clientX}px;
      width: 10px;
      height: 10px;
      border: 3px solid rgba(239, 68, 68, 0.9);
      border-radius: 50%;
      pointer-events: none;
      z-index: 999998;
      transform: translate(-50%, -50%) scale(1);
      animation: sigap-ripple 0.5s ease-out forwards;
    \`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 550);
  });

  window.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.background = 'radial-gradient(circle, #ef4444 40%, rgba(239, 68, 68, 0.4) 80%)';
  });

  window.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  const style = document.createElement('style');
  style.innerHTML = \`
    @keyframes sigap-ripple {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(4.5); opacity: 0; }
    }
  \`;
  document.head.appendChild(style);
})();
`;

async function smoothMove(page, targetX, targetY, steps = 25) {
  const currentPos = await page.evaluate(() => {
    const cur = document.getElementById('sigap-virtual-cursor');
    if (!cur) return { x: 100, y: 100 };
    return {
      x: parseFloat(cur.style.left || '100'),
      y: parseFloat(cur.style.top || '100')
    };
  });

  for (let i = 1; i <= steps; i++) {
    const interX = currentPos.x + ((targetX - currentPos.x) * i) / steps;
    const interY = currentPos.y + ((targetY - currentPos.y) * i) / steps;
    await page.mouse.move(interX, interY);
    await page.waitForTimeout(12);
  }
}

async function clickElement(page, selector, textHint = '') {
  const element = await page.waitForSelector(selector, { state: 'visible', timeout: 8000 });
  const box = await element.boundingBox();
  if (!box) throw new Error(`Element ${selector} tidak memiliki bounding box.`);

  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;

  console.log(`[Virtual Cursor] Menuju ke: ${textHint || selector}`);
  await smoothMove(page, centerX, centerY);
  await page.waitForTimeout(150);
  await page.mouse.down();
  await page.waitForTimeout(120);
  await page.mouse.up();
  await page.waitForTimeout(300);
}

export async function runVisualTest() {
  console.log('====================================================');
  console.log('🚀 Membuka Chromium Mandiri dengan Virtual Cursor...');
  console.log('====================================================');

  const browser = await chromium.launch({
    headless: false, // Jendela browser terbuka di layar
    slowMo: 60,      // Sedikit diperlambat agar gerakan kursor terlihat natural
    args: ['--start-maximized', '--window-size=1280,820']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  // Injeksi kursor visual setiap kali ada navigasi atau pergantian halaman
  await page.addInitScript(VIRTUAL_CURSOR_INJECTION);

  try {
    console.log('1. Mengakses http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // Cek apakah di halaman login
    const isLogin = await page.$('input[placeholder*="username" i], input[type="text"]');
    if (isLogin) {
      console.log('2. Mengisi formulir login superadmin...');
      const userInput = await page.$('input[type="text"]');
      const passInput = await page.$('input[type="password"]');

      if (userInput && passInput) {
        const uBox = await userInput.boundingBox();
        await smoothMove(page, uBox.x + uBox.width / 2, uBox.y + uBox.height / 2);
        await userInput.fill('superadmin');
        await page.waitForTimeout(200);

        const pBox = await passInput.boundingBox();
        await smoothMove(page, pBox.x + pBox.width / 2, pBox.y + pBox.height / 2);
        await passInput.fill('admin123');
        await page.waitForTimeout(300);

        const submitBtn = await page.$('button[type="submit"]');
        if (submitBtn) {
          const sBox = await submitBtn.boundingBox();
          await smoothMove(page, sBox.x + sBox.width / 2, sBox.y + sBox.height / 2);
          await submitBtn.click();
          await page.waitForTimeout(1000);
        }
      }
    }

    console.log('3. Membuka Halaman Pengaturan & Hak Akses...');
    await page.goto('http://localhost:3000/pengaturan', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Gerakkan kursor ke kartu Profil Akun Aktif
    const profileCard = await page.$('text=Profil Akun Aktif');
    if (profileCard) {
      const box = await profileCard.boundingBox();
      await smoothMove(page, box.x + box.width / 2, box.y + box.height / 2 + 50);
      await page.waitForTimeout(800);
    }

    console.log('4. Membuka Dropdown Akun Superadmin di Navbar...');
    const avatarBtn = await page.$('header button');
    if (avatarBtn) {
      const aBox = await avatarBtn.boundingBox();
      await smoothMove(page, aBox.x + aBox.width / 2, aBox.y + aBox.height / 2);
      await avatarBtn.click();
      await page.waitForTimeout(1200);
    }

    console.log('5. Membuka Halaman Master Wilayah & SLS...');
    await page.goto('http://localhost:3000/master-wilayah', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Klik Kecamatan Sambas
    const sambasCard = await page.$('text=Kecamatan Sambas');
    if (sambasCard) {
      console.log('6. Mengklik Kecamatan Sambas untuk melihat rincian Desa & SLS...');
      const sBox = await sambasCard.boundingBox();
      await smoothMove(page, sBox.x + sBox.width / 2, sBox.y + sBox.height / 2);
      await sambasCard.click();
      await page.waitForTimeout(1500);

      // Scroll ke bawah dengan kursor
      await smoothMove(page, 640, 500);
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(1000);
    }

    console.log('✅ Uji visual selesai dengan sempurna!');
    await page.waitForTimeout(2000);

  } catch (err) {
    console.error('Error saat pengujian visual:', err);
  } finally {
    await browser.close();
    console.log('Jendela Chromium ditutup.');
  }
}

// Jalankan jika dipanggil via node
if (process.argv[1]?.endsWith('test-visual.js')) {
  runVisualTest();
}
