const PackageHandler = require("../package-handler/package-handler.js")
const path = require("path")
const {changeBranch} = require("./git-handler.js")
const fs = require("fs-extra")
const {setupDirs} = require("../init/init.js")

module.exports = async function featureChange(name){
    const pkg = new PackageHandler(path.resolve(process.cwd(), "./package.json"))
    const {workbook} = await pkg.getData()
    if(workbook.git && workbook['git-branch']) changeBranch(name)
    await setupFeatureDir(name)
    await copyFeatureTest(name)

}
async function setupFeatureDir(name){
    await setupDirs()
    try{
        const dir = path.resolve(process.cwd(), `./src/features/${name}`)
        await fs.access(dir)
    } catch {
        await fs.mkdir(dir)
    }
}

async function copyFeatureTest(name){
    const target = path.resolve(process.cwd(), `./src/features/${name}`)
    const src = path.resolve(__dirname, "../../../templates/feature")
    try{
        await fs.copy(src, target)
    } catch {
        console.error(`Unable to copy sample files to destination: [${target}]`)
    }
}