#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import {
  userAgentPath,
  cookiePath,
  searchesPath,
  soap2daySearchUrl,
} from '../../config/constants.js';
import { spinner } from '../spinner.js';
import chalk from 'chalk';
import { IMedia, OptionsType } from '../../types/index.js';
import { PuppeteerLaunchOptions } from 'puppeteer';

puppeteer.use(StealthPlugin());

const fetchMedias = async (query: string, options: OptionsType) => {
  const ua = fs.readFileSync(userAgentPath).toString();
  const cookie = JSON.parse(fs.readFileSync(cookiePath).toString());

  const { ui, spinnerIntervalId } = spinner(
    'Searching for Movies and Series'
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

  const page = await browser.newPage();
  await page.setUserAgent(ua);
  await page.setCookie(...cookie);
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

  await page.goto(`${soap2daySearchUrl}${query}`, {
    waitUntil: 'domcontentloaded',
  });

  const medias: IMedia[] = await page.evaluate(() => {
    // Fetch the first element with class "quote"
    const cards = document.querySelectorAll('.thumbnail');
    const cardArr = Array.from(cards);
    const cardLinks: IMedia[] = [];
    cardArr.map((card) => {
      let type: 'movie' | 'series';
      const year: any = card.querySelector('.img-tip')?.textContent;

      const name: any = card.querySelector('h5 > a')?.textContent;
      const link: any = card.querySelector('h5 > a')?.getAttribute('href');

      const length: any = card.querySelector('h5')?.children.length;
      if (length == 2) {
        type = 'series';
      } else {
        type = 'movie';
      }
      cardLinks.push({
        name: `${name}`,
        type,
        year,
        link,
      });
    });

    return cardLinks;
  });

  ui.updateBottomBar(chalk.green.bold(' Search complete \u2713 '));
  clearInterval(spinnerIntervalId);

  await browser.close();

  if (!fs.existsSync(searchesPath)) {
    //If Searches folder does not exit create
    fs.mkdirSync(searchesPath, { recursive: true });
  }

  fs.writeFileSync(
    path.join(searchesPath, `${query}.json`),
    JSON.stringify(medias),
    'utf-8'
  );

  return medias;
};

export default fetchMedias;
