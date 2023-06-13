#!/usr/bin/env node
import fs from 'fs';
import { Command } from 'commander';
import { appPath } from './config/constants.js';
import chalk from 'chalk';

const program = new Command();

function main() {
  program.action(() => {});

  if (fs.existsSync(appPath)) {
    fs.rmSync(appPath, { recursive: true, force: true });
    console.log(chalk.green('Removed all cache files \u2713'));
  }
  program.parse(process.argv);
}

main();
