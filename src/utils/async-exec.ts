import {exec} from 'child_process';

export const asyncExec = async (command: string): Promise<string> => {
  return await new Promise((resolve) => {
    exec(command, (error, stdout) => {
      resolve(stdout);
    });
  });
};
