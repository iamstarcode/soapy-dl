import cliProgress from 'cli-progress';
import { DownloaderHelper } from 'node-downloader-helper';
import chalk from 'chalk';
import { createFolderIfNotFound } from '../io/index.js';

const ratio = process.stdout.columns <= 56 ? 0.2 : 0.25;

const bar = new cliProgress.SingleBar(
  {
    format: '{bar} {percentage}% || {downloaded}/{size} || Speed: {speed}/s ',
    hideCursor: true,
    barsize: process.stdout.columns * ratio,
    forceRedraw: true,
  },
  cliProgress.Presets.shades_classic
);

//'https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?cs=srgb&dl=pexels-christian-heitz-842711.jpg&fm=jpg',

function humanFileSize(bytes: number, si = false) {
  let u,
    b = bytes,
    t = si ? 1000 : 1024;
  ['', si ? 'k' : 'K', ...'MGTPEZY'].find(
    (x) => ((u = x), (b /= t), b ** 2 < 1)
  );
  return `${u ? (t * b).toFixed(1) : bytes}${u}${!si && u ? 'i' : ''}B`;
}
const download = async (
  url: string,
  folder: undefined | string = undefined
) => {
  createFolderIfNotFound(`./${folder}`);

  const dl = new DownloaderHelper(
    url,
    `./${folder}`, {
    //resumeIfFileExists: true,
    //resumeOnIncomplete: true,
  }
  );

  const size = await dl.getTotalSize();

  bar.start(100);

  dl.on('error', (err) => {
    bar.stop();
    console.log('Download Failed', err);
  });

  dl.on('progress', ({ speed, progress, downloaded }) => {
    bar.update(Math.ceil(progress), {
      speed: humanFileSize(speed),
      downloaded: humanFileSize(downloaded),
      size: humanFileSize(size.total ?? 0),
    });
  });

  dl.on('end', () => {
    bar.stop();
    console.log(chalk.greenBright(` Download complete \u2713 `)); //
  });

  await dl.start().catch((err) => {
    console.error(err);
    bar.stop();
  });
};

export default download;
