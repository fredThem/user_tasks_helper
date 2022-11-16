/* eslint-disable no-console */
import cProcess from 'child_process';
import fs from 'fs';
import path from 'path';

import pkg from 'enquirer';

const { Select, Toggle } = pkg;

// get
const v5PackageJson = JSON.parse(
  fs.readFileSync(
    path.resolve(process.cwd(), 'node_modules/@cbcradcan/vcinq/package.json'),
    'utf8',
  ),
);

const currentPackageJson = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'),
);

/**
check devDependencies from "node_modules/@cbcradcan/vcinq/package.json"
compare it with dependencies from current package.json
look for shared dependencies and flag any mismatched versions and prompt to update the current project dependencies to match exactly the shared dependencies (or prompt to ignore)
 */

const v5Dependencies = {
  ...v5PackageJson.dependencies,
  ...v5PackageJson.devDependencies,
};

const currentDependencies = {
  ...currentPackageJson.dependencies,
  ...currentPackageJson.devDependencies,
};

const sharedDependencies = Object.keys(v5Dependencies).filter(
  (key) => currentDependencies[key],
);

const sharedDepsMismatchedVersions = sharedDependencies.filter(
  (key) => v5Dependencies[key] !== currentDependencies[key],
);

const sharedDepsMismatchedVersionsList = sharedDepsMismatchedVersions.map(
  (key) => `${key}: ${currentDependencies[key]} => ${v5Dependencies[key]}`,
);

const message = `
V5 Diagnose Dependencies
Cet outil permet de vérifier les dépendances partagées entre le projet et V5.
Il est recommandé de mettre à jour les dépendances partagées pour éviter les problèmes de compatibilité.

Dépendances partagées:
${sharedDepsMismatchedVersionsList.join(',\n')}
`;
async function initUpdate() {
  const prompt = new Select({
    name: 'update',
    message,
    choices: [
      {
        name: 'update',
        message: 'Mettre à jour les dépendances partagées',
      },
      {
        name: 'ignore',
        message: 'Ignorer',
      },
    ],
  });

  const response = await prompt.run();

  if (response === 'update') {
    // form to select which dependencies to update
    // multiple select

    const promptMulti = new Select({
      name: 'update',
      message: 'Sélectionner les dépendances à mettre à jour',
      choices: sharedDepsMismatchedVersionsList,
      multiple: true,
    });

    const responseMulti = await promptMulti.run();

    const dependenciesToUpdate = responseMulti.map((dep) =>
      dep.replace(/:\s+.+=>\s+/, '@'),
    );

    const promptConfirm = new Toggle({
      name: 'confirm',
      message: `Êtes-vous certain de vouloir mettre à jour les dépendances suivantes: \n${dependenciesToUpdate.join(
        ',\n',
      )}\n`,
      // default is "Oui"
      enabled: 'Oui',
      disabled: 'Non',
    });

    const responseConfirm = await promptConfirm.run();

    if (responseConfirm) {
      // replace anything between ":" and "=> " with "@"
      const dependenciesToUpdateString = dependenciesToUpdate.join(' ');

      const command = `cd ${process.cwd()} &&
      npm install ${dependenciesToUpdateString}`;
      console.log(`Exécution de la commande: ${command}`);
      cProcess.execSync(
        command,
        // cwd
        {
          stdio: 'inherit',
          cwd: process.cwd(),
        },
      );
    }
  }
}
if (sharedDepsMismatchedVersions.length) {
  initUpdate();
} else {
  console.log('Aucune dépendance partagée trouvée');
}
