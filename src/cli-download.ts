#!/usr/bin/env node

import { Command } from 'commander';
import downloadAction from './actions/download.js';
import { commaSeparatedList } from './helpers/cliParsers.js';

const program = new Command();

function main() {
  program
    .argument('<string>', 'TV series or Movie name')
    /* .option(
      '-e, --episodes <episodes>',
      'comma episodes list',
      commaSeparatedList
    ) */
    .option('-d, --debug', 'Debuggin')
    .option('-f, --force', 'Force refecth')
    .option('-ep, --executablePath <string>', 'Path to executable for puppeter')
    .action(downloadAction);

  program.parseAsync(process.argv);
}

main();
