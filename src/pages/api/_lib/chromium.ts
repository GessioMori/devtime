import puppeteer, { Page } from 'puppeteer-core';
import { getOptions } from './chromiumOpts';

let _page: Page | null;

async function getPage(isDev: boolean): Promise<Page> {
  if (_page) {
    return _page;
  }

  const options = await getOptions(isDev);
  const browser = await puppeteer.launch(options);

  _page = await browser.newPage();

  return _page;
}

export async function getScreenshot(
  html: string,
  isDev: boolean
): Promise<Buffer | string> {
  const page = await getPage(isDev);

  await page.setViewport({ width: 460, height: 180 });
  await page.setContent(html);
  await page.evaluateHandle('document.fonts.ready');
  await page.evaluate(() => (document.body.style.background = 'transparent'));
  await page.waitForSelector('#card');
  const card = await page.$('#card');

  if (card) {
    const file = await card.screenshot({
      type: 'png',
      omitBackground: true
    });
    return file;
  }

  return '';
}
