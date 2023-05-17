import fs from 'fs';
import { argv } from 'process';

import detectIndent from 'detect-indent';

/* eslint-disable no-console */

argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});

const sourcePath = argv[2];
const action = argv[3];
console.log({ sourcePath });

// const source = fs.readFileSync(`${sourcePath}/babel.config.json`, 'utf-8');
const source = fs.readFileSync(
  `${sourcePath}/node_modules/@cbcradcan/vcinq/babel.config.json`,
  'utf-8',
);
console.log('🚀 ~ file: babel-custom.js ~ line 21 ~ source', source);
// console.log*
const regex = /,\s+}/gm;
const sourceSub = source.replaceAll(regex, '}');
console.log('🚀 ~ file: babel-custom.js ~ line 30 ~ sourceSub', sourceSub);
const indent = detectIndent(sourceSub).indent || '  ';
let pack = JSON.parse(sourceSub);
console.log({ pack });

export const customBabel = () => {
  // commandOptions = "--if-present"

  if (action == 'add') {
    // pack.plugins = ["@babel/plugin-transform-react-jsx-source"]
    // pack.env = {

    console.log('👾👾Pack', pack);
    console.log('👾👾👾👾👾👾Pack.env.dev.pluggins', pack.env.development);

    pack = {
      ...pack,
      // plugins: ['@babel/plugin-transform-react-jsx-source'],
      env: {
        ...pack.env,
        development: {
          ...pack.env.development,
          plugins: [
            // ...pack.env.development.plugins,
            ['babel-plugin-styled-components'],
          ],
        },
      },
    };
  } else if (action == 'delete') {
    delete pack.plugins;
    delete pack.env;
  }

  console.log('🎯🎯🎯🎯Pack.env.dev.pluggins', pack);

  fs.writeFileSync(
    `${sourcePath}/node_modules/@cbcradcan/vcinq/babel.config.json`,
    JSON.stringify(pack, null, indent),
  );
};

customBabel();
