import path from 'path'
import fs from 'fs-extra'
// ====================
// Helper Read / Write Functions for the package.json file
// ====================


// ====================
// READ
// ====================
// Read a json file given a root address followed by subfolders to file
export async function read(root, ...subFolders){
    const target = path.resolve(root, ...subFolders)
    try{
        await fs.access(target)
        const file = await fs.readFile(target)
        return JSON.parse(file)

    }catch(err){
        console.error(err)
        process.exit(1)
    }
}

export async function readWorkshop(root){
    return await read( root, "./workshop/package.json")
}
export async function readMainPkg(){
    return await read(process.cwd(), "./package.json")
}

export async function getName(root){
    const data = await readWorkshop(root)
    return data.name 
}


// ====================
// WRITE
// ====================
//Write a json file given an object, the root dir, and subsequent subfolders
export async function write(options, root, ...subfolders){
    const {data, replace} = options
    const target = path.resolve(root, ...subfolders)
    if(!replace){
        const currentData = await readWorkshop(root)
        data = {...currentData, ...data}
    }
    try{
        await fs.access(target)
        await fs.writeFile(target, JSON.stringify(data,null,2))
    }catch(err){
        console.error(err)
        process.exit(1)
    }
}

export async function writeWorkshopObj(options){
    const mainPkg =  await readMainPkg()
    if(!mainPkg.workshop) mainPkg.workshop = {}
    const workshopObj = {
        git: 
            options.git !== undefined ? 
            !!options.git : 
            mainPkg.workshop.git !== undefined ? 
            mainPkg.workshop.git : 
            true,
        ['git-branch']: 
            options.gitBranch !== undefined ? 
            !!options.git : 
            mainPkg.workshop['git-branch'] !== undefined ? 
            mainPkg.workshop['git-branch'] : 
            true, 
        hours: 
            options.hours !== undefined ?
            options.hours >= 0 ? 
                options.hours : 
                0 :
            0 
    }
    mainPkg.workshop = workshopObj 
    await write({data: mainPkg, replace: true}, process.cwd(), "./package.json")
}

export async function rename(name, root){
    const data = await readWorkshop(root)
    data.name = name 
    try {
        await writeWorkshop(data, root, true)
        return true
    }
    catch (err){
        console.error(err)
        process.exit(1)
    }
}


export async function writeWorkshop(data, root, replace=false){
    return await write({data, replace}, root, "./workshop/package.json")
}