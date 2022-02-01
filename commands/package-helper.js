import path from 'path'
import fs from 'fs-extra'
// ====================
// Helper Read / Write Functions for the package.json file
// ====================
export async function readWorkshop(root){
    return await read( root, "./workshop/package.json")
}
export async function readMainPkg(){
    return await read(process.cwd(), "./package.json")
}

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


export async function getName(root){
    const data = await readWorkshop(root)
    return data.name 
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

export async function write(data, root, replace=false, ...subfolders){
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

export async function writeWorkshop(data, root, replace=false){
    return await write(data, root, replace, "./workshop/package.json")
}