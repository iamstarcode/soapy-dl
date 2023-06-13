#!/usr/bin/env node

import fs from 'fs';
import path from 'node:path';

import chalk from 'chalk';
import _ from 'lodash';

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

import { spinner } from '../spinner.js';
import { IMedia, ISeriesMedia, OptionsType } from '../../types/index.js';
import {
  userAgentPath,
  cookiePath,
  soap2dayBaseUrl,
  appPath,
} from '../../config/constants.js';
import { createFolderIfNotFound } from '../io/index.js';
import { PuppeteerLaunchOptions } from 'puppeteer';

const fetchSeriesMedias = async (mediaInfo: IMedia, options: OptionsType) => {
  const linksPath = path.join(appPath + '/Links/' + mediaInfo.name + '.json');
  const exist = fs.existsSync(linksPath + '');
  if (!options?.force) {
    if (exist) {
      const series: ISeriesMedia = JSON.parse(
        fs.readFileSync(linksPath).toString()
      );
      return series;
    } else return await handleFecth(mediaInfo, options);
  } else {
    return await handleFecth(mediaInfo, options); ////
  }
};

const handleFecth = async (mediaInfo: IMedia, options: any) => {
  const ua = fs.readFileSync(userAgentPath).toString();
  const cookie = JSON.parse(fs.readFileSync(cookiePath).toString());

  const { ui, spinnerIntervalId } = spinner(
    `Searching for '${mediaInfo.name}' links`
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

  page.on('request', async (request) => {
    if (
      ['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

  await page.goto(`${soap2dayBaseUrl}${mediaInfo.link}`, {
    waitUntil: 'domcontentloaded',
  });

  const medias: any = await page.evaluate(() => {
    const cards = document.querySelectorAll(
      'div.alert.alert-info-ex.col-sm-12'
    );

    const seasons = Array.from(cards);
    const mapped = seasons.map((card, index) => {
      console.log(card.innerHTML);
      //const season: any = card.querySelector('h4')?.textContent;
      const episodesEl = card.querySelectorAll(
        'div.col-sm-12.col-lg-12 > div > a'
      );

      const episodes: any[] = [];
      for (let i = 0; i < episodesEl.length; i++) {
        const e = episodesEl[i];
        const start = e.innerHTML.indexOf('.') + 1;
        const title = e.innerHTML;
        episodes.push({
          episode: episodesEl.length - i,
          title: title.substring(start),
          link: e.getAttribute('href'),
        });
      }

      return {
        season: `Season ${seasons.length - index}`,
        number: cards.length - index,
        episodes,
      };
    });

    return mapped;
  });

  //

  const links: ISeriesMedia = { ...mediaInfo, seasons: medias };

  createFolderIfNotFound(appPath + '/Links');

  fs.writeFileSync(
    path.join(appPath + '/Links/' + mediaInfo.name + '.json'),
    JSON.stringify(links),
    'utf-8'
  );

  ui.updateBottomBar(chalk.green.bold(' Search complete \u2713 '));
  clearInterval(spinnerIntervalId);

  return links;
};

export default fetchSeriesMedias;
