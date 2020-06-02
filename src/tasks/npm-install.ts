import {exec} from 'child_process';
import ora from 'ora';

import {ProjectSettings} from '../init-project';

const asyncExec = async (command: string): Promise<void> => {
  await new Promise((resolve) => {
    exec(command, () => {
      resolve();
    });
  });
};

export const npmInstall = async ({project}: ProjectSettings): Promise<void> => {
  const spinner = ora().start('installing npm dependencies');
  const oldPath = process.cwd();
  process.chdir(project);
  await asyncExec('npm install --silent');
  process.chdir(oldPath);
  spinner.stop();
};
