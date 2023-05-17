import { execSync } from 'child_process';
import fs from 'fs';
import { argv } from 'process';

import chalk from 'chalk';
import clipboard from 'clipboardy';
import detectIndent from 'detect-indent';
import pkg from 'enquirer';

const { Select, prompt } = pkg;

/* eslint-disable no-console */
 
/**
 * npm link {fileWorkspaceDirectory} @cbcradcan/vcinq to ../vcinq
 * only if the link target "version" is the same as the current version
 */

export const linkVcinq = () => {
  argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
  });

  const sourcePath = argv[2];
  console.log({ sourcePath });

  const source = fs.readFileSync(`${sourcePath}/package.json`, 'utf-8');
  const indent = detectIndent(source).indent || '  ';
  const pack = JSON.parse(source);
  const { version, dependencies } = pack;

  const V5_VERSION = dependencies['@cbcradcan/vcinq'];
  const currentPackage = execSync('npm list @cbcradcan/vcinq --depth=0', {
    encoding: 'utf-8',
  });

  const getLocalV5Version = fs.readFileSync(`../vcinq/package.json`, 'utf-8');
  const V5_VERSION_LOCAL = JSON.parse(getLocalV5Version).version;

  // if V5_VERSION is the same as V5_VERSION_LOCAL npm link
  console.log(
    chalk.cyanBright(`Current version: ${V5_VERSION} => ${V5_VERSION_LOCAL}`),
  );
  //link @cbcradcan/vcinq to local version

  // prompt the user to link the local version of @cbcradcan/vcinq to the current package or not
  const linkPrompt = new Select({
    name: 'link',
    message: `Link @cbcradcan/vcinq@${V5_VERSION} to ../vcinq (@${V5_VERSION_LOCAL})? (Y/n)`,
    choices: ['Yes', 'No'],
  });

  linkPrompt.run().then((answer) => {
    if (answer === 'Yes') {
      //link the current package to the local version of @cbcradcan/vcinq
      const linkCommand = execSync('npm link ../vcinq --install-links', {
        encoding: 'utf-8',
        cwd: sourcePath,
      });

      console.log(chalk.cyanBright(linkCommand));
      console.log(
        chalk.cyanBright(
          `Linked @cbcradcan/vcinq@${V5_VERSION} to ../vcinq (@${V5_VERSION_LOCAL})`,
        ),
      );
    } else {
      console.log(
        chalk.cyanBright(
          `Not linking @cbcradcan/vcinq@${V5_VERSION} to ../vcinq (@${V5_VERSION_LOCAL})`,
        ),
      );
    }
  });
};
//   prom
linkVcinq();
