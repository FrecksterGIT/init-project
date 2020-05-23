import {exec} from 'child_process';

const asyncExec = async (command: string): Promise<void> => {
  await new Promise((resolve) => {
    exec(command, () => {
      resolve();
    });
  });
};

export const gitInit = async (projectName: string): Promise<void> => {
  const oldPath = process.cwd();
  process.chdir(projectName);
  await asyncExec('git init -q ./');
  await asyncExec('git add .');
  await asyncExec('git commit -aqm "chore: initialize project"');
  process.chdir(oldPath);
};
