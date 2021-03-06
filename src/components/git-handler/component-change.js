import PackageHandler from "../package-handler/package-handler"
import path from "path"
import { commit } from "./git-handler"
import fs from "fs-extra"
import { setupDirs } from "../init/init"
import { resolveFromUrl } from "../test-helper/test-helper"

export async function componentChange(name){
    const pkg = new PackageHandler(path.resolve(process.cwd(), "./package.json"))
    const {workshop} = await pkg.getData()
    if(workshop.git) {
        const options ={ push: workshop['git-branch']}
        await commit(options) 
    }
    await setupComponentDir(name)
    await copyComponentFiles(name)
}



async function setupComponentDir(name){
    await setupDirs()
    const dir = path.resolve(process.cwd(), `./src/components/${name}`)
    try{
        
        await fs.access(dir)
    } catch {
        await fs.mkdir(dir)
    }
}

async function copyComponentFiles(name){
    const target = path.resolve(process.cwd(), `./src/components/${name}`)
    const src = resolveFromUrl(import.meta.url, "../../../../templates/component")
    try{
        await fs.copy(src, target)
    } catch {
        console.error(`Unable to copy sample files to destination: [${target}]`)
    }
}