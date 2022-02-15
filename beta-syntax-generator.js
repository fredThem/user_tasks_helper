/* eslint-disable no-undef */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import clipboard from "clipboardy"
import chalk from "chalk"
import { argv } from "process"
import detectIndent from "detect-indent"

import pkg from "enquirer"
const { Select, prompt } = pkg

import fs from "fs"
import { execSync } from "child_process"

/* eslint-disable no-console */
/* eslint-disable no-useless-escape */

export const betaSyntaxPublish = () => {
  argv.forEach((val, index) => {
    console.log(`${index}: ${val}`)
  })

  const gitBranch = argv[3]
  const sourcePath = argv[2]

  console.log({ gitBranch })
  console.log({ sourcePath })

  const source = fs.readFileSync(`${sourcePath}/package.json`, "utf-8")
  const indent = detectIndent(source).indent || "  "
  const pack = JSON.parse(source)
  const { version } = pack

  const preparePublishing = ["prepublish", "prepublishOnly", "type-check"].map(
    function (e) {
      return `npm run ${e} --if-present && `
    }
  )
  console.log(chalk.red(preparePublishing.join("")))
  // eslint-disable-next-line max-len
  // Test si le nom de la branch contient d'association au ticket jira ie:"MNMN-1234"
  const regexGitBranchWorkItem = /\/[A-Za-z]+[-_]?[0-9]+/

  const neon = chalk.cyanBright
  const success = chalk.greenBright

  if (regexGitBranchWorkItem.test(gitBranch)) {
    console.log(
      neon(`
╔╗ ┌─┐┌┬┐┌─┐  ╦  ╦┌─┐┬─┐┌─┐┬┌─┐┌┐┌  ╔═╗┌─┐┌┐┌┌─┐┬─┐┌─┐┌┬┐┌─┐┬─┐
╠╩╗├┤  │ ├─┤  ╚╗╔╝├┤ ├┬┘└─┐││ ││││  ║ ╦├┤ │││├┤ ├┬┘├─┤ │ │ │├┬┘
╚═╝└─┘ ┴ ┴ ┴   ╚╝ └─┘┴└─└─┘┴└─┘┘└┘  ╚═╝└─┘┘└┘└─┘┴└─┴ ┴ ┴ └─┘┴└─
Current branch name:
${gitBranch}
`)
    )
  } else {
    console.error(
      `⛔️ La syntaxe de la branche "${gitBranch}" doit contenir l'ID d'association au ticket jira (ie:"MNMN-1234")`
    )
    process.exit(1)
  }

  const beta = {
    pre: "0.0.0-beta-from",
    fromVersion: "",
    workItem: regexGitBranchWorkItem
      .exec(gitBranch)[0]
      .replaceAll(/[\/]/gm, ""),
    betaVersion: version.split(".").at(-1),
  }
  console.log(
    `From {"Version" : "` + chalk.bold.yellow(`${pack.version}`) + `"}`
  )

  // TODO : Évaluer si une version beta a déjà été publié sous `${pack.name}@${pack.version}`. Si oui mettre a jour `pack.version`dans package.json pour matcher la dernière version publié, continuer.

  initPublish()

  async function initPublish() {
    const choices = [
      { message: `Incrémenter et publier une nouvelle beta`, name: "publier" },
      {
        message: `Copier la commande pour installer la beta`,
        name: "install",
      },
      { message: `Renommer la branche ${gitBranch}`, name: "corriger" },
    ]

    const prompt = new Select({
      type: "select",
      message: `Que voulez vous faire ?`,
      initial: 0,
      format: () => "",
      choices,
    })

    try {
      const choice = await prompt.run()
      startFromChoice(choice)
    } catch {
      process.exit(0)
    }
  }
  async function copyInstallCommand(pack) {
    // pack.version = `${beta.pre}${beta.fromVersion}-${beta.workItem}.${Number(beta.betaVersion)}`
    const installCommand = `npm i ${pack.name}@${pack.version} --save-exact`

    console.log(`\n\n>>>>>>>>>>>>>>> Installez la beta publié avec:`)
    console.log(success(installCommand) + "\n")
    clipboard.writeSync(installCommand)
  }

  async function startFromChoice(choice) {
    if (choice === "publier") {
      const isBeta = version.startsWith(beta.pre)

      if (!isBeta) {
        beta.fromVersion = pack.version.replaceAll(".", "")
        pack.version = `${beta.pre}${beta.fromVersion}-${beta.workItem}.0`
      } else {
        const re = /(?!0.0.0-beta-from)[0-9]{2,}/
        beta.fromVersion = re.exec(version)
        pack.version = `${beta.pre}${beta.fromVersion}-${beta.workItem}.${
          Number(beta.betaVersion) + 1
        }`
      }

      fs.writeFileSync(
        `${sourcePath}/package.json`,
        JSON.stringify(pack, null, indent)
      )

      /*       // versionExists(pack.name, pack.version).then(exists => console.log(exists))
      const checkIfPublished = (name, version) => {
        const checkCommand= `npm view ${name} versions`
        console.log("🚀 ~ file: beta-syntax-generator.js ~ line 137 ~ checkIfPublished ~ checkCommand", checkCommand)
        // const checkOutPut = exec(checkCommand, { encoding: "utf-8", cwd: `${argv[2]}` }, )
        const checkOutPut = exec(checkCommand,{cwd:`${argv[2]}`}, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        });
        console.log("checkOutPut",checkOutPut)
        return checkOutPut
      }
      checkIfPublished(pack.name, pack.version);
 */
      const publishCommand = `cd ${sourcePath} ${preparePublishing.join(
        ""
      )} npm publish --tag beta`
      console.log(success(publishCommand))
      execSync(publishCommand, { encoding: "utf-8" })

      copyInstallCommand(pack)
    } else if (choice === "install") {
      // pack.version = `${pack.version}`
      copyInstallCommand(pack)
    } else if (choice === "corriger") {
      // process.exit(0);
      const currentName = gitBranch

      const newName = await prompt({
        type: "input",
        name: "branch",
        message: `
  ancien  :   ${currentName}
  nouveau :`,
      })

      console.log(newName.branch)
      console.log("same work item?", newName.branch.includes(beta.workItem))
      process.exit(0)
      // execSync(`git branch -m ${newName.input}`, { encoding: "utf-8" });
      initPublish()
    }
  }
}

betaSyntaxPublish()
