import ora from 'ora';

const stream = require('stream');
const {promisify} = require('util');
const fs = require('fs');
const got = require('got');

const pipeline = promisify(stream.pipeline);

export const download = async (template: string): Promise<string> => {
  const spinner = ora().start('Fetching template info');

  try {
    const response = await got.get(`https://api.github.com/repos/${template}/releases/latest`).json();
    if (response.zipball_url) {
      const asset = `${response.node_id}.zip`;
      spinner.text = `Fetching ${response.zipball_url}`;

      await pipeline(
        got.stream(response.zipball_url),
        fs.createWriteStream(asset)
      );
      spinner.stop();
      return asset;
    }
  } catch (e) {
    spinner.stop();
  }

  return '';
};
