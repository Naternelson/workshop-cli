// ====================
// Imports 
// ====================
const PackageHandler = require("../package-handler/package-handler.js")
const path = require("path")
const fs = require("fs-extra")

module.exports =  async function init(options){
    setupDirs()
    await setupPackageFile(options)
}

async function askQuestions(questions){
    
}


async function setupPackageFile(options){
    const pkg = new PackageHandler(path.resolve(process.cwd(), "./package.json"))
    const data = await pkg.getData()
    const {git, gitBranch} = options
    const workshopObj = {git, ['git-branch']: gitBranch}
    data.workshop = data.workshop ? {...data.workshop, ...workshopObj} : workshopObj
    pkg.data = data 
    await pkg.save()
}

async function setupDirs(){
    const root = process.cwd()
    const mkPath = (...dir) => path.resolve(root, ...dir)
    const arr = [mkPath("./src/components"), mkPath("./src/features")]

    await mkdir(mkPath("./src"))
    await Promise.all(arr.map(async dir => {await mkdir(dir)}))
}

async function mkdir(dir){
    try{
        await fs.access(dir)
    } catch {
        console.log(dir)
        await fs.mkdir(dir)
    }

}