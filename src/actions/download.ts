#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import fetchMedias from '../helpers/pup/fetchMedias.js';
import { searchesPath } from '../config/constants.js';
import getCookie from '../helpers/pup/getCookie.js';
import { IMedia, OptionsType } from '../types/index.js';
import inquireMedias from '../inquires/inquireMedias.js';
import handleDownload from '../helpers/downloads/handleDownlaod.js';
import chalk from 'chalk';

const downloadAction = async (query: string, options: OptionsType) => {
  console.log('args', query, options);

  await getCookie(options);

  let mediaInfo: IMedia | null;

  //when no [-f] force and is undefined and we use the cache
  if (!options.force) {
    if (!fs.existsSync(path.join(searchesPath, `${query}.json`))) {
      const medias: IMedia[] = await fetchMedias(query, options);
      mediaInfo = await inquireMedias(medias);
      await handleDownload(mediaInfo, options);
    } else {
      console.log('file exits use save search');
      const medias: any = fs.readFileSync(
        path.join(searchesPath, `${query}.json`)
      );
      mediaInfo = await inquireMedias(JSON.parse(medias));
      await handleDownload(mediaInfo, options);
    }
  } else {
    console.log('force a new fecth');
    const medias = await fetchMedias(query, options);
    mediaInfo = await inquireMedias(medias);
    await handleDownload(mediaInfo, options);
  }
};

export default downloadAction;
