#!/usr/bin/env node

import fs from 'fs';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

import {
  userAgentPath,
  cookiePath,
  soap2dayBaseUrl,
} from '../../config/constants.js';
import getCookie from './getCookie.js';
import { PuppeteerLaunchOptions } from 'puppeteer';
import { OptionsType } from '../../types/index.js';

const fetchVideoLink = async ({
  name,
  link,
  options,
}: {
  name: string;
  link: string;
  options: OptionsType;
}) => {
  await getCookie(options);

  let videoLink;

  const ua = fs.readFileSync(userAgentPath).toString();
  const cookie = JSON.parse(fs.readFileSync(cookiePath).toString());

  let launchOptions: PuppeteerLaunchOptions;
  if (!options.executablePath) {
    launchOptions = { headless: 'new' };
  } else {
    launchOptions = {
      executablePath: options.executablePath,
      headless: 'new',
    };
  }

  if (options.debug) {
    launchOptions.headless = false
  }

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  await page.setUserAgent(ua);
  await page.setCookie(...cookie);
  await page.setRequestInterception(true);

  page.on('request', async (request) => {
    if (
      ['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

  try {
    const requestUrl = 'https://soap2day.ac/home/index/GetMInfoAjax';
    const [res] = await Promise.all([
      page.waitForResponse((response) => response.url().includes(requestUrl)),
      page.goto(`${soap2dayBaseUrl}${link}`, { waitUntil: 'domcontentloaded' }),
    ]);

    const response = await res.json();
    videoLink = JSON.parse(response).val;
    await browser.close();
    return videoLink;
  } catch (error) { }

  return videoLink ?? '';
};

export default fetchVideoLink;
