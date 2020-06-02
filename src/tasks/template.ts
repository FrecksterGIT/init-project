import {ProjectSettings} from '../init-project';

const fs = require('fs');
const path = require('path');
const prompt = require('inquirer').prompt;

const templateQuestion = () => (
  {
    type: 'rawlist',
    name: 'template',
    message: 'The template for the new project:',
    choices: [
      {
        name: 'feature-app',
        value: 'FrecksterGIT/template-feature-app',
      },
      {
        name: 'service',
        value: 'FrecksterGIT/template-service',
      },
    ],
  });

const namespaceQuestion = () => (
  {
    type: 'rawlist',
    name: 'scope',
    message: 'Scope for the project:',
    choices: [
      {
        name: 'das-buro-am-draht',
        value: 'das-buro-am-draht',
      },
      {
        name: 'volkswagen-onehub',
        value: 'volkswagen-onehub',
      },
    ],
  });


const projectQuestion = (projectName: string) => ({
  type: 'input',
  name: 'project',
  message: 'The name for the new project:',
  default: projectName || '',
  validate: (input: string) => {
    if (input.length === 0) return 'Please insert a name for the new project.';
    if (fs.existsSync(path.join(process.cwd(), input))) return 'Directory already exists.';
    return true;
  },
});

export const template = async (projectName: string): Promise<ProjectSettings> => {
  return await prompt([
    templateQuestion(),
    namespaceQuestion(),
    projectQuestion(projectName),
  ]).then((answers: ProjectSettings) => {
    return answers;
  });
};
