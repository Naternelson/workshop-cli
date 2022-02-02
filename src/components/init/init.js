// ====================
// Imports 
// ====================
const PackageHandler = require("../package-handler/package-handler.js")
const path = require("path")
module.exports =  async function init(options){
    await setupPackageFile(options)
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