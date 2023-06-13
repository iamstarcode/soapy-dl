#!/usr/bin/env node

import { Command } from 'commander';

function main() {
  const program = new Command();

  program
    .name('cli')
    .version('1.0.0')
    .command('download', 'Download a TV series or Movie')
    .command('clear', 'Clear cache');
  program.parseAsync(process.argv);
}

main();
