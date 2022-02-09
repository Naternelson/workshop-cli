import PackageHandler from "../package-handler/package-handler"
import path from 'path'
import fs from "fs-extra"
import { commit } from "../git-handler/git-handler"
export default async function save({message}={}){
    const pkg = new PackageHandler(path.resolve(process.cwd(), "./package.json"))
    try{
        const [, workshop] = await checks(pkg)
        if(workshop.git){
            const push = workshop.remote
            if(message === "") message = null 
            commit({push, message})
        }
    } catch (err){
        console.log("Couldn't save properly")
    }
    
}





// ====================
// Helper functions
// ====================


function checks(pkg){
    return Promise.all([
        fs.pathExists(pkg.filepath),
        getWorkshop(pkg)
    ])
}

async function getWorkshop(pkg){
    await pkg.getData()
    return pkg.data.workshop
}
