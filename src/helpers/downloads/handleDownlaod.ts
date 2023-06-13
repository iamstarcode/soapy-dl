import chalk from 'chalk';
import { IMedia, ISeriesMedia, OptionsType } from '../../types';
import fetchVideoLink from '../pup/fetchVideoLink.js';
import download from './download.js';
import fetchSeriesMedias from '../pup/fetchSeriesMedias.js';
import inquirerEpisodes from '../../inquires/inquireEpisopes.js';
import inquireSeason from '../../inquires/inquireSeason.js';
import path from 'path';
import { spinner } from '../spinner.js';

const handleDownload = async (mediaInfo: IMedia, options: OptionsType) => {


  if (mediaInfo.type == 'movie') {
    const url =
      'https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?cs=srgb&dl=pexels-christian-heitz-842711.jpg&fm=jpg';

    const { ui, spinnerIntervalId } = spinner(
      `Searching for '${mediaInfo.name}' details`
    );


    const link = await fetchVideoLink({ ...mediaInfo, options });
    ui.updateBottomBar(chalk.green.bold(' Search complete \u2713 '));
    clearInterval(spinnerIntervalId);

    console.log(chalk.yellow(`Now downloading: ${mediaInfo.name}`));

    try {
      await download(link, mediaInfo.name);
    } catch (error) {
      console.log(chalk.red('An error occured, please try again!'));
      if (options.debug) {
        console.log(error);
      }
    }
  } else if (mediaInfo.type == 'series') {
    const series: ISeriesMedia = await fetchSeriesMedias(mediaInfo, options);

    const seasons = await inquireSeason(series);

    const episodes = await inquirerEpisodes(seasons); //

    const dd = []

    for (let i = 0; i < episodes.length; i++) {
      const name = `Season ${episodes[i].season} Episode: ${episodes[i].episode}`;
      const link = episodes[i].link;

      const { ui, spinnerIntervalId } = spinner(
        `Searching for '${name}' details`
      );

      //console.log(chalk.yellow(`Searching for '${name}' details`));

      const vidoeLink = await fetchVideoLink({ name, link, options });

      dd.push(vidoeLink)

      const url =
        'https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?cs=srgb&dl=pexels-christian-heitz-842711.jpg&fm=jpg';

      try {
        ui.updateBottomBar(chalk.green.bold(' Search complete \u2713 '));
        ui.clean()
        clearInterval(spinnerIntervalId);
        console.log(chalk.green(` Now downloading: ${name} `));
        await download(
          vidoeLink,
          path.join(mediaInfo.name, `S${episodes[i].season}`)
        );
      } catch (error) {
        console.log(chalk.red('An error occured, please try again!'));
        //console.log(error);
      }
    }

    // console.log(dd)
  }
};

export default handleDownload;
