#!/usr/bin/env node

import {replacePlaceHolders} from './tasks/replace-placeholders';
import {template} from './tasks/template';
import {download} from './tasks/download';
import {unpack} from './tasks/unpack';
import {gitInit} from './tasks/git-init';
import {cleanup} from './tasks/cleanup';
import {npmInstall} from './tasks/npm-install';

const clear = require('clear');
const program = require('commander');

export interface ProjectSettings {
  template: string;
  scope: string;
  project: string;
}

clear();
program
  .version('0.0.1')
  .description('Initialize new project folders')
  .arguments('new-project-name')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

template(program.args[0] ?? '').then(async (settings: ProjectSettings) => {
  const asset = await download(settings);
  if (asset) {
    await unpack(settings, asset);
    await replacePlaceHolders(settings);
    // await npmInstall(settings);
    await gitInit(settings);
    await cleanup(asset);
  }
});
