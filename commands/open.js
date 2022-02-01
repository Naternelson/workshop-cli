import fs from "fs-extra";
import save from "./save.js";
import path from 'path'
import chalk from "chalk";

export default async function open(name, options){
    
    if(options.save) {
        console.log("\nSaving current workshop...")
        await save()
    }
    await resetWorkshop()
    const dirName = path.resolve(process.cwd(), "./src/components", `./${name}`)
    try{
        await fs.access(dirName)
        const files = await fs.readdir(dirName)
        const promises = []
        files.forEach(f => {
            promises.push(copyFile(f, dirName))
        })
        await Promise.all(promises)
        console.log("")
    } catch (err){
        console.error(err)
    }
}

async function copyFile(f, dirName){
    const copyFrom = path.resolve(dirName, `./${f}`)
    await fs.access(copyFrom)
    let target = path.resolve(process.cwd(), `./src/workshop/`)
    if(f.includes('.test')) {
        target = path.resolve(target, `./tests/${f}`)
    } else if(f.includes(".json")){
        target = path.resolve(target, `./${f}`)
    } else {
        target = path.resolve(target, `./units/${f}`)
    }
    await fs.copyFile(copyFrom, target)
    await fs.access(target)
    console.log(`\tTransferring ${chalk.blue.bold(f)} to workshop`)
}

export async function resetWorkshop () {
    const dirName = path.resolve(process.cwd(), "./src/workshop")
    await fs.rm(dirName, {recursive: true, force: true})
    await fs.mkdir(dirName)
    await fs.mkdir(path.resolve(dirName, "./units"))
    await fs.mkdir(path.resolve(dirName, "./tests"))
    await fs.writeFile(path.resolve(dirName, "./package.json"), JSON.stringify({name: "null"}, null, 2))
    console.log("\n Workshop reset")
}

export async function reset(options){
    if(options.save) {
        console.log("\nSaving current workshop...")
        await save()
    }
    await resetWorkshop()
}