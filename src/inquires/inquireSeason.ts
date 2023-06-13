import inquirer from 'inquirer';
import _ from 'lodash';

import { ISeriesMedia } from '../types/index.js';

const inquireSeason = async (series: ISeriesMedia) => {
  type Season = (typeof series.seasons)[number];

  const seasons = series.seasons;

  const inq: Season[] = await inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'season',
        message: 'Select season(s) to download from ',
        pageSize: 10,
        searchable: true,
        choices: seasons.map((s: Season) => ({
          name: s.season,
          value: s.number,
        })),
        validate: function (answer: any) {
          if (answer.length == 0) {
            return 'You must choose at least one season.';
          }
          return true;
        },
      },
    ])
    .then((answers: any) => {
      const selectedSeasons: Season[] = [];
      answers.season.forEach((e: number) => {
        const season = _.filter(series.seasons, (s: Season) => s.number === e);
        selectedSeasons.push(...season);
      });

      return selectedSeasons;
    })
    .catch((error: any) => {
      console.log(error);
    });
  return inq;
};

export default inquireSeason;
