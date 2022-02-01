import { rename, getName } from "./package-helper.js"
import path from 'path'
import chalk from "chalk"
export default async function reName(name){
    const target =  path.resolve(process.cwd(), "./src")
    
    try{
        const oldName = await getName(target)
        await rename(name, target)
        if(oldName || oldName !== "null" || oldName !== "") console.log(`${chalk.blue(oldName)} renamed to ${chalk.magenta(name)}`)
        else console.log(`Component named ${chalk.magenta(name)}`)
    } catch (err){
        console.error(err)
    }
}