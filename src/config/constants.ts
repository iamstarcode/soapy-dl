import path from 'node:path';

import fileDirName from '../utils/file-dir-name.js';

import { homedir } from 'os';

export const { __dirname, __filename } = fileDirName(import.meta);

export const appPath = path.join(homedir(), '/soapy-dl');
export const searchesPath = path.join(appPath, 'Searches');
export const mediaLinksPath = path.join(appPath, 'Links');
export const userAgentPath = path.join(appPath, 'user-agent');
export const cookiePath = path.join(appPath, 'cookie.json');
export const soap2dayBaseUrl = 'https://soap2day.ac';
export const soap2daySearchUrl = 'https://soap2day.ac/search/keyword/';

export const downloadPath = 'Downloads';
