const fs = require('fs');
const path = require('path');
const extract = require('extract-zip');
const ncp = require('ncp').ncp;

import ora from 'ora';

export const unpack = async (asset: string, projectName: string): Promise<void> => {
  const spinner = ora().start('Preparing project folder...');
  const targetDir = path.resolve(process.cwd(), projectName);
  fs.mkdirSync(targetDir);

  try {
    await extract(asset, {dir: targetDir});

    const target = await fs.promises.opendir(targetDir);
    const subdir = await target.read();
    target.closeSync();
    if (subdir) {
      const sourceDir = path.join(targetDir, subdir?.name);
      await new Promise((resolve) => {
        ncp(sourceDir, targetDir, () => {
          resolve();
        })
      });
      await fs.promises.rmdir(sourceDir, {
        recursive: true
      });
    }
    spinner.stop();
  } catch (e) {
    spinner.stop();
  }
};
