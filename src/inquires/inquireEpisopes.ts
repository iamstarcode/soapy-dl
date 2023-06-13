import inquirer from 'inquirer';
import { ISeriesMedia } from '../types/index.js';
import _ from 'lodash';

const inquirerEpisodes = async (seasons: any) => {
  const choices = [];
  for (let i = 0; i < seasons?.length; i++) {
    const episodes: any[] = seasons[i].episodes;

    _.reverse(episodes);

    const items: any[] = [];
    episodes.forEach((episode: any, j: number) => {
      items.push({ season: seasons[i].number, ...episode });
    });

    choices.push(
      new inquirer.Separator(`>>> Season ${seasons[i].number} <<<`),
      ...items
    );
  }
  const inq = await inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'episodes',
        message: 'Select epispodes(s)',
        pageSize: 10,
        searchable: true,
        loop: false,
        choices: choices.map((choice, index) =>
          choice.title === undefined
            ? choice
            : {
                name: `Episode: ${choice.episode} Tittle: ${choice.title}`,
                value: choice,
              }
        ),
        validate: function (answer: ISeriesMedia[]) {
          if (answer.length == 0) {
            return 'You must choose at least one episode.';
          }
          return true;
        },
      },
    ])
    .then((answers: any) => {
      return answers.episodes;
    })
    .catch((e: any) => console.log(e));

  return inq;
};

export default inquirerEpisodes;
