import { getName } from "./package-helper.js"
import path from 'path'
import { reset } from "./open.js"
import fs from "fs-extra"
import chalk from "chalk"

export default async function remove(name){
    const root = path.resolve(process.cwd(), "./src")
    if(!name){
        const root = path.resolve(process.cwd(), "./src")
        const targetName = await getName(root)
        reset({save: false})
        if(!targetName) return 
    }
    let target = path.resolve(root, `./components/${name}`)
    try {
        await fs.access(target)
        await fs.rm(target, {recursive: true, force: true})
        console.log(`Component:${chalk.cyan.bold(name)} deleted`)
    } catch {
        console.log("Component", name, "not found")
    }
    
}