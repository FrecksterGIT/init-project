#!/usr/bin/env node

import {replacePlaceHolders} from './tasks/replace-placeholders';

const clear = require('clear');
const program = require('commander');

import {Settings} from './interfaces/interfaces';
import {template} from './questions/template';
import {download} from './tasks/download';
import {unpack} from './tasks/unpack';
import {gitInit} from './tasks/git-init';
import {cleanup} from './tasks/cleanup';

clear();
program
  .version('0.0.1')
  .description('Initialize new project folders')
  .arguments('new-project-name')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

template(program.args[0] ?? '').then(async (settings: Settings) => {
  const asset = await download(settings.template);
  if (asset) {
    await unpack(asset, settings.project);
    await replacePlaceHolders(settings.template, settings.project);
    await gitInit(settings.project);
    await cleanup(asset);
  }
});
