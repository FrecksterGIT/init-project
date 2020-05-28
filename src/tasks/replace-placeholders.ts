import ora from 'ora';
import {Settings} from '../interfaces/interfaces';

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const camelcase = require('camelcase');

interface Terms {
  [pattern: string]: string;
}

interface RenameOpts {
  target: string;
  terms: Terms;
  scope: string;
}

const findFiles = async (dir: string): Promise<string[]> => {
  return new Promise<string[]>((resolve) => {
    glob(dir, (err: unknown, files: string[]) => {
      resolve(files);
    });
  });
};

const replace = (content: string, terms: Terms) => {
  for (const term in terms) {
    if (terms.hasOwnProperty(term)) {
      content = content.replace(new RegExp(term, 'g'), terms[term]);
    }
  }
  return content;
};

const replaceScope = (content: string, scope: string): string => {
  return content
    .replace(/"name": "@freckstergit\//, `"name": "@${scope}/`)
    .replace(/github.com\/FrecksterGIT\//i, `github.com/${scope}/`);
};

const handleFile = async (filePath: string, terms: Terms, scope: string): Promise<boolean> => {
  try {
    if (!fs.lstatSync(filePath).isFile()) {
      return true;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    if (path.basename(filePath) === 'package.json') {
      content = replaceScope(content, scope);
    }
    fs.writeFileSync(filePath, replace(content, terms), 'utf8');

    const filename = path.basename(filePath);
    const toFilename = replace(filename, terms);
    if (filename !== toFilename) {
      fs.renameSync(filePath, path.join(path.dirname(filePath), toFilename));
    }
  } catch (e) {
    return false;
  }
  return true;
};

const replaceFiles = async (opts: RenameOpts): Promise<boolean> => {
  const files = await findFiles(opts.target);
  const fileResults = await Promise.all(
    files.map(filePath => handleFile(filePath, opts.terms, opts.scope)),
  );

  return !fileResults.some(result => !result);
};

export const replacePlaceHolders = async ({template, project, scope}: Settings): Promise<boolean> => {
  const projectName = camelcase(project);
  const ProjectName = camelcase(project, {pascalCase: true});

  const placeholder = (template.indexOf('/') >= 0)
    ? template.replace(/[^\/]+\//, '')
    : template;
  const placeHolder = camelcase(placeholder);
  const PlaceHolder = camelcase(placeholder, {pascalCase: true});

  const spinner = ora().start('Updating project...');
  const result = await replaceFiles({
    target: `./${project}/**/*`,
    terms: {
      [placeholder]: project,
      [placeHolder]: projectName,
      [PlaceHolder]: ProjectName,
    },
    scope,
  });
  spinner.stop();

  return result;
};
