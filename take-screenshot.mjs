import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
await page.screenshot({ path: 'settings-screenshot.png' });
await browser.close();
console.log('Screenshot saved to settings-screenshot.png');
