/* eslint-disable no-undef */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import { argv } from "process"
import detectIndent from "detect-indent"

import fs from "fs"

/* eslint-disable no-console */
/* eslint-disable no-useless-escape */

argv.forEach((val, index) => {
  console.log(`${index}: ${val}`)
})

const sourcePath = argv[2]
const action = argv[3]
console.log({ sourcePath })

const source = fs.readFileSync(`${sourcePath}/babel.config.json`, "utf-8")
console.log("🚀 ~ file: babel-custom.js ~ line 21 ~ source", source)
// console.log*
const regex = /,\s+}/gm
const sourceSub = source.replaceAll(regex, "}")
console.log("🚀 ~ file: babel-custom.js ~ line 30 ~ sourceSub", sourceSub)
const indent = detectIndent(sourceSub).indent || "  "
let pack = JSON.parse(sourceSub)
console.log({ pack })

export const customBabel = () => {
  // commandOptions = "--if-present"

  if (action == "add") {
    // pack.plugins = ["@babel/plugin-transform-react-jsx-source"]
    // pack.env = {

    // }
    pack = {
      ...pack,
      plugins: ["@babel/plugin-transform-react-jsx-source"],
    }
  } else if (action == "delete") {
    delete pack.plugins
    delete pack.env
  }
  fs.writeFileSync(
    `${sourcePath}/babel.config.json`,
    JSON.stringify(pack, null, indent)
  )
}

customBabel()
