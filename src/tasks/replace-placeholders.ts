import ora from 'ora';

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const camelcase = require('camelcase');

interface RenameOpts {
  target: string;
  terms: {
    [pattern: string]: string;
  }
}

async function replaceFiles(opts: RenameOpts) {

  const replace = (content: string) => {
    for (const term in opts.terms) {
      content = content.replace(new RegExp(term, 'g'), opts.terms[term]);
    }
    return content;
  };

  return new Promise(async (resolve, reject) => {
    try {
      const filePromises = [];

      filePromises.push(new Promise<string>(resolve => {
        glob(opts.target, (err: unknown, files: string[]) => {
          resolve(...files);
        });
      }));

      const files = await Promise.all(filePromises);

      const replacePromises = new Array<Promise<void>>();

      files.forEach(filePath => {
        replacePromises.push(new Promise<void>(async (resolve) => {
          if (!fs.lstatSync(filePath).isFile()) {
            resolve();
            return;
          }

          let content = fs.readFileSync(filePath, 'utf8');
          fs.writeFileSync(filePath, replace(content), 'utf8');

          const filename = path.basename(filePath);
          const toFilename = replace(filename);

          if (filename !== toFilename) {
            fs.renameSync(filePath, path.join(path.dirname(filePath), toFilename));
          }
          resolve();
        }));
      });

      await Promise.all(replacePromises);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

export const replacePlaceHolders = async (template: string, project: string): Promise<void> => {
  const projectName = camelcase(project);
  const ProjectName = camelcase(project, {pascalCase: true});

  const placeholder = (template.indexOf('/') >= 0)
    ? template.replace(/[^\/]+\//, '')
    : template;
  const placeHolder = camelcase(placeholder);
  const PlaceHolder = camelcase(placeholder, {pascalCase: true});

  const spinner = ora().start('Updating project...');
  await replaceFiles({
    target: `./${project}/**/*`,
    terms: {
      [placeholder]: project,
      [placeHolder]: projectName,
      [PlaceHolder]: ProjectName,
    },
  });

  spinner.stop();
};
