import inquirer from 'inquirer';
import inquirerSearchList from 'inquirer-search-list';
import { IMedia } from '../types';
import _ from 'lodash';

const inquireMedias = async (medias: IMedia[]) => {
  inquirer.registerPrompt('search-list', inquirerSearchList);

  const inq: IMedia = await inquirer
    .prompt([
      {
        type: 'search-list',
        message: 'Select a Movie or TV show',
        name: 'media',
        askAnswered: true,
        choices: medias.map((s) => ({
          name: `${s.name} [${s.type.toUpperCase()}]`,
          value: s.name,
        })),
      },
    ])
    .then(function (answers: { media: IMedia }) {
      const mediaInfo = _.find(medias, (o: any) => o.name == answers.media);
      return mediaInfo;
    })
    .catch((e: any) => console.log(e));

  return inq;
};

export default inquireMedias;
