import fs from 'fs';
import UserAgent from 'user-agents';

import chalk from 'chalk';
import path from 'path';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());
import { appPath } from '../../config/constants.js';
import { createFileIfNotFound } from '../io/index.js';
import { spinner } from '../spinner.js';
import { OptionsType } from '../../types/index.js';
import { PuppeteerLaunchOptions } from 'puppeteer';

const saveCookie = async (options: OptionsType) => {
  const { ui, spinnerIntervalId } = spinner(
    'Please wait while we fetch cookie'
  );

  let launchOptions: PuppeteerLaunchOptions;

  if (!options.executablePath) {
    launchOptions = { headless: 'new' };
  } else {
    launchOptions = {
      executablePath: options.executablePath,
      headless: 'new',
    };
  }

  const browser = await puppeteer.launch(launchOptions);

  let userAgent = createFileIfNotFound(
    appPath,
    'user-agent',
    new UserAgent().toString()
  );

  const page = await browser.newPage();
  await page.setUserAgent(userAgent.toString());
  await page.setRequestInterception(true);

  page.on('request', (request) => {
    if (
      ['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

  await page.goto('https://soap2day.ac/', {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForSelector('.btn[disabled]');
  await page.waitForSelector('.btn:not([disabled])');
  await page.click('.btn');
  await page.waitForNavigation();
  const cookie = await page.cookies();

  fs.writeFileSync(
    path.join(appPath, 'cookie.json'),
    JSON.stringify(cookie),
    'utf-8'
  );

  await browser.close();
  ui.updateBottomBar(chalk.green.bold(' Fetch complete \u2713 ')); //
  clearInterval(spinnerIntervalId);
};
//saveCookie();
export default saveCookie;
