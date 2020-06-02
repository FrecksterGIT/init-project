import ora from 'ora';

import {ProjectSettings} from '../init-project';
import {asyncExec} from '../utils/async-exec';

export const npmInstall = async ({project}: ProjectSettings): Promise<void> => {
  const spinner = ora().start('installing npm dependencies');
  const oldPath = process.cwd();
  process.chdir(project);
  await asyncExec('npm install --silent');
  process.chdir(oldPath);
  spinner.stop();
};
