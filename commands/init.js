import chalk from 'chalk'
import path from 'path'
import fs from 'fs-extra'
import {execa} from 'execa'
import { readMainPkg, writeWorkshop } from './package-helper'

async function init(options){
    const target =  path.resolve(process.cwd(), "./src")
    const current = import.meta.url 
    const template = path.resolve(new URL(current).pathname, "../../templates/workshop/")
    await handleGitSetup(options)
    await setupComponents({target})
    await(copyWorkshop({target, template, overwrite:true},))
    
}

export async function copyWorkshop({target, template, overwrite}){
    try{
        await fs.access(template, fs.constants.R_OK)
        await fs.rm(path.resolve(target, "./workshop"), { recursive: true, force: true })
        await fs.copy(template, target, {overwrite})
        await fs.access(path.resolve(target, "./workshop"), fs.constants.R_OK)
        console.log(`${chalk.blue.bold("/workshop")} template files generated`)
    } catch (err){
        console.log(chalk.red.bold(err))
        console.log("Workshop failed to initiate")
        process.exit(1)
    }
}
export async function setupComponents({target}){
    const targetDir = path.resolve(target, './components')
    try{
        await fs.access(targetDir) 
        return true
    } catch {
        await fs.mkdir(targetDir)
        console.log(`${chalk.blue.bold("/components")} folder generated`)
        return true 
    }   
}

async function handleGitSetup(options){
    await writeWorkshopObj(options)
}



export default init 
