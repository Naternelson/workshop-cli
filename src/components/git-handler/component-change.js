const PackageHandler = require("../package-handler/package-handler.js")
const path = require("path")
const {commit} = require("./git-handler.js")
const fs = require("fs-extra")
const {setupDirs} = require("../init/init.js")

module.exports = async function componentChange(name){
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
    const src = path.resolve(__dirname, "../../../templates/component")
    try{
        await fs.copy(src, target)
    } catch {
        console.error(`Unable to copy sample files to destination: [${target}]`)
    }
}