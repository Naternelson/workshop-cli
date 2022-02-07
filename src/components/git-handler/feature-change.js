import PackageHandler from "../package-handler/package-handler"
import path from "path"
import { changeBranch } from "./git-handler"
import fs from "fs-extra"
import { setupDirs } from "../init/init"
import { resolveFromUrl } from "../test-helper/test-helper"

export async function featureChange(name){
    const pkg = new PackageHandler(path.resolve(process.cwd(), "./package.json"))
    const {workshop} = await pkg.getData()

    if(workshop.git && workshop['git-branch']) changeBranch(name)
    await setupFeatureDir(name)
    await copyFeatureTest(name)

}
async function setupFeatureDir(name){
    await setupDirs()
    const dir = path.resolve(process.cwd(), `./src/features/${name}`)
    try{
        await fs.access(dir)
    } catch {
        await fs.mkdir(dir)
    }
}

async function copyFeatureTest(name){
    const target = path.resolve(process.cwd(), `./src/features/${name}`)
    const src = resolveFromUrl(import.meta.url, "../../../../templates/feature")
    try{
        await fs.copy(src, target)
    } catch (err){
        console.error(`Unable to copy sample files to destination: [${target}]`)
        console.log(err)
    }
}