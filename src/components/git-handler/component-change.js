// const PackageHandler = require("../package-handler/package-handler.js")
// const path = require("path")
// const {commit} = require("./git-handler.js")
// const fs = require("fs-extra")
// const {setupDirs} = require("../init/init.js")

import PackageHandler from "../package-handler/package-handler"
import path from "path"
import { commit } from "./git-handler"
import fs from "fs-extra"
import { setupDirs } from "../init/init"

export async function componentChange(name){
    const pkg = new PackageHandler(path.resolve(process.cwd(), "./package.json"))
    const {workbook} = await pkg.getData()
    if(workbook.git) {
        const options ={ push: workbook['git-branch']}
        await commit(options) 
    }
    await setupComponentDir(name)
    await copyComponentFiles(name)
}



async function setupComponentDir(name){
    await setupDirs()
    try{
        const dir = path.resolve(process.cwd(), `./src/components/${name}`)
        await fs.access(dir)
    } catch {
        await fs.mkdir(dir)
    }
}

async function copyComponentFiles(name){
    const target = path.resolve(process.cwd(), `./src/components/${name}`)
    const src = path.resolve(import.meta.url, "../../../templates/component")
    try{
        await fs.copy(src, target)
    } catch {
        console.error(`Unable to copy sample files to destination: [${target}]`)
    }
}