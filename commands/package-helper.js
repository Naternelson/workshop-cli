import path from 'path'
import fs from 'fs-extra'
// ====================
// Helper Read / Write Functions for the package.json file
// ====================
export async function read(root){
    const target = path.resolve(root, "./workshop/package.json")
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
    const data = await read(root)
    return data.name 
}

export async function rename(name, root){
    const data = await read(root)
    data.name = name 
    try {
        await write(data, root, true)
        return true
    }
    catch (err){
        console.error(err)
        process.exit(1)
    }
}

export async function write(data, root, replace=false){
    const target = path.resolve(root, "./workshop/package.json")
    if(!replace){
        const currentData = await read(root)
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