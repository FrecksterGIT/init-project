import {ProjectSettings} from '../init-project';
import {asyncExec} from '../utils/async-exec';

export const gitInit = async ({project}: ProjectSettings): Promise<void> => {
  const oldPath = process.cwd();
  process.chdir(project);
  await asyncExec('git init -q ./');
  await asyncExec('git add .');
  await asyncExec('git commit -aqm "chore: initialize project"');
  process.chdir(oldPath);
};
