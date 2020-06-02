const os = require('os');
const fs = require('fs');
const stream = require('stream');
const {promisify} = require('util');

const got = require('got');
import ora from 'ora';

import {ProjectSettings} from '../init-project';

const pipeline = promisify(stream.pipeline);

const getToken = () => {
  const npmrc = fs.readFileSync(os.homedir() + '/.npmrc', 'utf8');
  const match = npmrc.match(/\/\/npm\.pkg\.github\.com\/:_authToken=(.*)/);

  return match?.[1].trim();
}

export const download = async ({template}: ProjectSettings): Promise<string> => {
  const spinner = ora().start('Fetching template info');

  try {
    const repoInfo = `https://api.github.com/repos/${template}/releases/latest`;
    const token = getToken();

    spinner.text = repoInfo;
    const body = await got.get(repoInfo, {
      headers: {
        authorization: `token ${token}`,
      }
    }).json();

    if (body.zipball_url) {
      const asset = `${body.node_id}.zip`;
      spinner.text = `Fetching ${body.zipball_url}`;

      await pipeline(
        got.stream(body.zipball_url, {
          headers: {
            authorization: `token ${token}`,
          }
        }),
        fs.createWriteStream(asset),
      );
      spinner.stop();
      return asset;
    }
  } catch (e) {
    console.warn(e.message);
    spinner.stop();
  }

  return '';
};
