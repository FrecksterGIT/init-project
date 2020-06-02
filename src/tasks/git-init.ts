import {exec} from 'child_process';
import {ProjectSettings} from '../init-project';

const asyncExec = async (command: string): Promise<void> => {
  await new Promise((resolve) => {
    exec(command, () => {
      resolve();
    });
  });
};

export const gitInit = async ({project}: ProjectSettings): Promise<void> => {
  const oldPath = process.cwd();
  process.chdir(project);
  await asyncExec('git init -q ./');
  await asyncExec('git add .');
  await asyncExec('git commit -aqm "chore: initialize project"');
  process.chdir(oldPath);
};
