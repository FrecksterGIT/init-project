import {Dirent} from 'fs';

const fs = require('fs');
const path = require('path');
const extract = require('extract-zip');
const ncp = require('ncp').ncp;

import ora from 'ora';
import {ProjectSettings} from '../init-project';

export const unpack = async ({project}: ProjectSettings, asset: string): Promise<void> => {
  const spinner = ora().start('Preparing project folder...');
  const targetDir = path.resolve(process.cwd(), project);
  fs.mkdirSync(targetDir);

  try {
    await extract(asset, {dir: targetDir});

    const target = await fs.promises.opendir(targetDir);
    const subDir: Dirent = await target.read();
    target.closeSync();
    if (subDir) {
      const sourceDir = path.join(targetDir, subDir.name);
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
