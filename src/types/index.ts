export interface IMedia {
  name: string;
  link: string;
  type: 'movie' | 'series';
  year?: string;
}

export interface ISeriesMedia extends IMedia {
  seasons: [
    {
      season: string;
      number: number;
      episodes: [
        {
          episode: number;
          title: string;
          episodeTitle: string;
          episodeLink: string;
        }
      ];
    }
  ];
}

export type Seasons = Pick<ISeriesMedia, 'seasons'>;

export type OptionsType = {
  episodes?: [];
  debug?: boolean;
  force?: boolean;
  executablePath: string;
};
