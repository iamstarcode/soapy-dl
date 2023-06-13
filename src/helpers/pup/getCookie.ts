///#!/usr/bin/env node
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());
import fs from 'fs';
import { cookiePath } from '../../config/constants.js';
import dayjs from 'dayjs';
import saveCookie from './saveCookie.js';
import { OptionsType } from '../../types/index.js';

const getCookie = async (options: OptionsType) => {
  if (fs.existsSync(cookiePath)) {
    //console.log('cookie exit');
    const cookieFile: any[] = JSON.parse(
      fs.readFileSync(cookiePath).toString()
    );
    const cookieHasExpired = dayjs().isAfter(dayjs.unix(cookieFile[0].expires));

    if (cookieHasExpired) {
      //console.log('cookie has expired refresh');
      await saveCookie(options);
    }
  } else {
    //console.log('cookie does not exit get a new cookie');/////
    await saveCookie(options);
  }
};

//getCookie();
export default getCookie;
